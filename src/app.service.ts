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
    @InjectRepository(dbObject) private objRepo: Repository<dbObject>) { }

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
      const value = await this.cacheManager.set(obj.key, obj.value, { ttl: 3000 });
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
      foundObj = this.cacheManager.set(key, newData.value, { ttl: 3000 });
      return {
        data: newData.value
      }
    }
  }

  async saveToDb(): Promise<any> {
    const keys = await this.cacheManager.store.keys();
    console.log("all keys:", keys);
    let allData = [];
    for (let value of keys) {
      const foundObj = await this.cacheManager.get(value);
      allData.push({ key: value, value: foundObj });
    }
    console.log("allData:", allData);

    this.objRepo.create(allData);
    await this.objRepo.save(allData);
  }

  async getAll(): Promise<dbObject[]> {
    const data = await this.objRepo.find();
    const cachArr = [];
    for (const item of data) {
      const key = await this.create(item as objCreateDto);
      cachArr.push({ key:key, value: item });
    }
    console.log("data from db:",cachArr);
    return cachArr;
  }

}
