import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor() {}

  @Get()
  getHello(): {message:string} {
    return {
      message:'Welcome to the File System.'
    };
  }
}
