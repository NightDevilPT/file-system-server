import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // ✅ Enable cookie parser
  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  // Apply Response Interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('File System Management')
    .setDescription('The File System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
