import { Injectable, CACHE_MANAGER, Inject, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { objCreateDto } from './dto/createObj.dto';
import { objUpdateDto } from './dto/updateObj.dto';
import { dbObject } from './entity/dbObj';

@Injectable()
export class AppService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
  @InjectRepository(dbObject) private objRepo: Repository<dbObject>){}

  async read(objKey: string): Promise<Object> {
    const value = await this.cacheManager.get(objKey);
    if (value) {
      return {
        data: value
      }
    }
    else { throw new HttpException("Wrong key!", 400) };
  }

  // async getAll():Promise <dbObject[]>{
  //   return this.objRepo.find();
  // }

  // should be deleted from db when expired from redis !
  async create(obj: objCreateDto): Promise<Object> {
    const foundedKey = await this.cacheManager.get(obj.key);
    if (!foundedKey) {
      const value = await this.cacheManager.set(obj.key, obj.value, { ttl: 300 });

      //console.log("value", value); // OK

      //for db
      this.objRepo.create(obj);
      this.objRepo.save(obj);

      return {
        key: obj.key
      }
    }
    else {
      throw new HttpException("Wrong key!", 400);
    }
  }

  async delete(key: string): Promise<Object> {
    const foundedKey = await this.cacheManager.get(key);
    if (!foundedKey) {
      throw new HttpException("Wrong key!", 400)
    }
    else {
      await this.cacheManager.del(key);

      //for db
      const foundedObj = this.objRepo.findOne({ where: { key } });
      this.objRepo.delete((await foundedObj).id);

      return {
        key: key,
        message: 'your item was deleted'
      }
    }
  }

  async update(key: string, newData: objUpdateDto): Promise<Object> {
    let foundObj = await this.cacheManager.get(key);
    if (!foundObj) {
      throw new HttpException("Wrong key!", 400)
    }
    else {
      foundObj = this.cacheManager.set(key, newData.value, { ttl: 300 });

      //for db
      const foundedDbObj = this.objRepo.findOne({ where: { key } });
      this.objRepo.update((await foundedDbObj).id,newData);

      return {
        data: newData.value
      }
    }
  }

}
