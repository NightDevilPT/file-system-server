import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { CreateFolderHandler } from './commands/create-folder.command';
import { UpdateFolderHandler } from './commands/update-folder.command';

const folderCommands = [CreateFolderHandler, UpdateFolderHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Profile, Folder])],
  controllers: [FolderController],
  providers: [FolderService, JwtAuthService, JwtService, ...folderCommands],
})
export class FolderModule {}
