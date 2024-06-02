import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { typeOrmConfig } from './ormConfig';
import { AllModules } from './modules';


const modules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) =>
      typeOrmConfig(configService),
    inject: [ConfigService],
  }),
  ...AllModules
];

@Module({
  imports: modules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
