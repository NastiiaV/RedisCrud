import {
  Body, CacheInterceptor, CacheKey, CacheTTL,
  Controller, Delete, Get, Param, Post, Put, UseInterceptors
} from '@nestjs/common';
//import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { objCreateDto } from './dto/createObj.dto';
import { objUpdateDto } from './dto/updateObj.dto';
import { dbObject } from './entity/dbObj';

@Controller()
//@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @CacheKey('myCustomKey')
  // @CacheTTL(300)

//   @Get()
//   findAll(): Promise<dbObject[]> {
//     return this.appService.getAll();
// }

  @Get(':key')
  getData(@Param('key') objKey: string): Promise<Object> {
    return this.appService.read(objKey);
  };

  @Post()
  setData(@Body() obj: objCreateDto): Promise<Object> {
    return this.appService.create(obj);
  }

  @Delete(':key')
  deleteData(@Param('key') objKey: string): Promise<Object> {
    return this.appService.delete(objKey);
  }

  @Put(':key')
  update(@Param('key') objKey: string, @Body() newData: objUpdateDto): Promise<Object> {
    return this.appService.update(objKey, newData);
  }
}
