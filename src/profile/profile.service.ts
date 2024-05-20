import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { CreateProfileCommand } from './command/create-profile.command';
import { UpdateProfileCommand } from './command/update-profile.command';

@Injectable()
export class ProfileService {
  constructor(private commandBus: CommandBus) {}

  createProfile(createProfileDto: CreateProfileDto, userId: string) {
    return this.commandBus.execute(
      new CreateProfileCommand(createProfileDto, userId),
    );
  }

  updateProfile(
    updateProfileDto: UpdateProfileDto,
    userId: string,
  ): Promise<Profile> {
    return this.commandBus.execute(
      new UpdateProfileCommand(updateProfileDto, userId),
    );
  }
}
