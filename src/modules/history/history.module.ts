import { Module } from '@nestjs/common';
import { historyCommands } from './command';
import { HistorySaga } from './saga/history.saga';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { History } from './entities/history.entity';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Folder } from '../folders/entities/folder.entity';
import { File } from '../files/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History,User,Profile,Folder,File]), CqrsModule],
  providers: [HistorySaga, ...historyCommands],
})
export class HistoryModule {}
