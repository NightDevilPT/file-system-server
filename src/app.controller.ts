import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { response } from './app.interface';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor() {}
}
