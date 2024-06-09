import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { OneOrTheOtherConstraint } from 'src/decorator/validate-one-or-other.decorator';
import { Folder } from './entities/folder.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { FolderCommands } from './commands';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Folder]), CqrsModule],
  controllers: [FoldersController],
  providers: [
    FoldersService,
    OneOrTheOtherConstraint,
    JwtAuthService,
    JwtService,
    ...FolderCommands
  ],
})
export class FoldersModule {}
