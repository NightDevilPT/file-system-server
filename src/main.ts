import * as express from 'express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/response.interceptor';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    { cors: true },
  );

  // ✅ Enable cookie parser
  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // ✅ Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('File System Management')
    .setDescription('The File System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  await app.init();

  // ✅ Only start the server when running locally
  if (process.env.NODE_ENV !== 'vercel') {
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Server running locally at http://localhost:${port}`);
  }
}

// ✅ Run `bootstrap()` immediately if running locally
if (require.main === module) {
  bootstrap();
}

// ✅ Export for Vercel
export default async function handler(req, res) {
  await bootstrap();
  server(req, res);
}
