import {
  Body, CacheKey, CacheTTL,
  Controller, Delete, Get, Param, Post, Put
} from '@nestjs/common';
//import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { objCreateDto } from './dto/createObj.dto';
import { objUpdateDto } from './dto/updateObj.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @CacheKey('myCustomKey')
  // @CacheTTL(300)
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
