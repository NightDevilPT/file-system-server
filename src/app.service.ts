import { Injectable } from '@nestjs/common';
import { response } from './app.interface';

@Injectable()
export class AppService {
  getHello(): response {
    return {
      message: 'Welcome to File Management System',
    };
  }
}
