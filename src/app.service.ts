import { Injectable, CACHE_MANAGER, Inject, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { objCreateDto } from './dto/createObj.dto';
import { objUpdateDto } from './dto/updateObj.dto';
import { dbObject } from './entity/dbObj';

@Injectable()
export class AppService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache){}
  //@InjectRepository(dbObject) private readonly objRepo: Repository<dbObject>)

  // async getAll(){
  //   const keys = await this.cacheManager;
  // }

  async read(objKey: string): Promise<Object> {
    const value = await this.cacheManager.get(objKey);
    if (value) {
      return {
        data: value
      }
    }
    else { throw new HttpException("Wrong key!", 400) };
  }


  async create(obj: objCreateDto): Promise<Object> {
    const foundedKey = await this.cacheManager.get(obj.key);
    if (!foundedKey) {
      const value = await this.cacheManager.set(obj.key, obj.value, { ttl: 300 });

      console.log("value", value); // OK

      //const objToCreate = this.objRepo.create(obj);
      return {
        key: obj.key
      }
    }
    else {
      throw new HttpException("Wrong key!", 400);
    }
  }

  async delete(objKey: string): Promise<Object> {
    const foundedKey = await this.cacheManager.get(objKey);
    if (!foundedKey) {
      throw new HttpException("Wrong key!", 400)
    }
    else {
      await this.cacheManager.del(objKey);
      return {
        key: objKey,
        message: 'your item was deleted'
      }
    }
  }

  async update(objKey: string, newData: objUpdateDto): Promise<Object> {
    let foundObj = await this.cacheManager.get(objKey);
    if (!foundObj) {
      throw new HttpException("Wrong key!", 400)
    }
    else {
      foundObj = this.cacheManager.set(objKey, newData.value, { ttl: 300 });
      return {
        data: newData.value
      }
    }
  }

}
