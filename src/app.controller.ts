import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
