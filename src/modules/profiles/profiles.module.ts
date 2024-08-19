import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { ProfileCommands } from './commands';
import { ProfileQueries } from './queries';
import { FirebaseService } from 'src/services/firebase-service/firebase.service';

@Module({
  imports:[CqrsModule,TypeOrmModule.forFeature([Profile,User])],
  controllers: [ProfilesController],
  providers: [ProfilesService,JwtService,AuthGuard,JwtAuthService,FirebaseService,...ProfileCommands,...ProfileQueries],
})
export class ProfilesModule {}
