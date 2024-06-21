// handlers/create-profile.handler.ts

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Profile } from '../../entities/profile.entity';
import { CreateProfileCommand } from '../impl/create-profile.command';
import { ProfileResponse, StorageType } from '../../interfaces/profile.interfaces';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  private readonly logger = new Logger(CreateProfileHandler.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventBus:EventBus
  ) {}

  async execute(command: CreateProfileCommand): Promise<ProfileResponse> {
    const { payload, userId } = command;
    this.logger.log(`Creating New profile : ${JSON.stringify(payload)}`);

    const userData = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (userData.profile) {
      throw new ConflictException('User already has a profile');
    }

    const createProfile = await this.profileRepository.create({
      ...payload,
      storageSize: 10,
      upgraded: StorageType.DEFAULT,
      user: userData,
    });

    const saveProfile = await this.profileRepository.save(createProfile);

    this.eventBus.publish(new CreateHistoryEvent(saveProfile.id,SharedEvents.ProfileCreatedEvent))
    return {
      data: saveProfile,
      message: 'profile successfully created',
    };
  }
}
