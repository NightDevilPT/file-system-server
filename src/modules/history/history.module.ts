import { Module } from '@nestjs/common';
import { historyCommands } from './command';
import { HistorySaga } from './saga/history.saga';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { History } from './entities/history.entity';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History,User,Profile]), CqrsModule],
  providers: [HistorySaga, ...historyCommands],
})
export class HistoryModule {}
