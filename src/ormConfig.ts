import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';

export const typeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  ssl: configService.get<boolean>('DB_SSL')
          ? { rejectUnauthorized: false }
          : false,
  synchronize: true,
  logging: true, // Enable TypeORM logging
  logger: 'advanced-console', // Use advanced console logger
  migrationsRun: true, // Run migrations automatically
  migrations: [__dirname + '/migrations/*.{js,ts}'],
});

// Establish the database connection and log the connection status
export const createConnection = async (
  configService: ConfigService,
  connection: Connection,
) => {
  if (!connection.isConnected) {
    await connection.connect();
    console.log('Connected to the database');
  } else {
    console.log('Already connected to the database');
  }
};
