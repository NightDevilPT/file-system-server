import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Folder } from '../folders/entities/folder.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { FileCommands } from './commands';
import { FirebaseService } from 'src/services/firebase-service/firebase.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, Folder, Profile]), CqrsModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    FirebaseService,
    JwtService,
    JwtAuthService,
    HashPasswordService,
    ...FileCommands,
  ],
})
export class FilesModule {}
