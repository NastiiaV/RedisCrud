import {
  Body, CacheInterceptor, CacheKey, CacheTTL,
  Controller, Delete, Get, Param, Post, Put, UseInterceptors
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
//import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { objCreateDto } from './dto/createObj.dto';
import { objUpdateDto } from './dto/updateObj.dto';
import { dbObject } from './entity/dbObj';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  setData(@Body() obj: objCreateDto): Promise<Object> {
    return this.appService.create(obj);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('auto-cache')
  findAll(): Promise<dbObject[]> {
    return this.appService.getAll();
  }

  @Cron('0 0 0 * * *')
  @Post('save-all')
  saveData(): Promise<any> {
    return this.appService.saveToDb();
  }

  @Get(':key')
  getData(@Param('key') objKey: string): Promise<Object> {
    return this.appService.read(objKey);
  };

  @Delete(':key')
  deleteData(@Param('key') objKey: string): Promise<Object> {
    return this.appService.delete(objKey);
  }

  @Put(':key')
  update(@Param('key') objKey: string, @Body() newData: objUpdateDto): Promise<Object> {
    return this.appService.update(objKey, newData);
  }

  
}
