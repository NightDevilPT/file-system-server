import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtAuthService } from 'src/services/jwt/jwt.service';

import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';

import { CreateProfileHandler } from './command/create-profile.command';
import { UpdateProfileHandler } from './command/update-profile.command';

const allCommands = [CreateProfileHandler, UpdateProfileHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Profile])],
  controllers: [ProfileController],
  providers: [ProfileService, JwtService, JwtAuthService, ...allCommands],
})
export class ProfileModule {}
