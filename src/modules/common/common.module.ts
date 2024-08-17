import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { Folder } from '../folders/entities/folder.entity';
import { File } from '../files/entities/file.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { BffController } from './common.controller';
import { CommonService } from './common.service';
import { QueryService } from 'src/services/query-service/query.service';
import { BffQueries } from './queries';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Folder, File, Profile, User]),
  ],
  controllers: [BffController],
  providers: [JwtService, JwtAuthService, CommonService, QueryService,...BffQueries],
})
export class CommonModule {}
