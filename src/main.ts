import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './interceptors/http-exception-filter.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Enable cookie parser
  app.use(cookieParser());

  // ✅ CORS Fix: Allow Specific Origins & Credentials
  app.enableCors({
    origin: ['http://localhost:3000', 'https://file-system-client.vercel.app'], // ✅ Array of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Include OPTIONS for preflight
    credentials: true, // ✅ Allow cookies & auth headers
    allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Explicitly allow headers
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // ✅ Enforce DTO validation
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter()); // ✅ Global Exception Handler
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // ✅ Swagger Setup (With Custom UI)
  const config = new DocumentBuilder()
    .setTitle('File System Management')
    .setDescription('The File System API description')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'File System API Docs',
    customfavIcon:
      'https://firebasestorage.googleapis.com/v0/b/file-system-e3b65.appspot.com/o/file-storage-avtar%2Flogo.png?alt=media&token=021e454f-f2fb-4885-9762-90844a76d349',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(
    `🚀 Swagger running at http://localhost:${port}/swagger\n🚀 Server running at http://localhost:${port}`,
  );
}
bootstrap();
