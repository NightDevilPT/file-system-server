// handlers/update-profile.handler.ts

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Profile } from '../../entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileCommand } from '../impl/update-profile.command';
import { getChangedFields } from 'src/utils/diff-utils';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  private readonly logger = new Logger(UpdateProfileHandler.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const { profileId, payload } = command;

    this.logger.log(`Updating profile with ID: ${profileId} `);

    try {
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });
      if (!profile) {
        throw new Error(`Profile with ID ${profileId} not found`);
      }

      const { from, to } = getChangedFields(profile, payload);

      if (payload.firstName) {
        profile.firstName = payload.firstName;
      }
      if (payload.lastName) {
        profile.lastName = payload.lastName;
      }
      if (payload.gender) {
        profile.gender = payload.gender;
      }

      const updateProfile = await this.profileRepository.save(profile);
      this.eventBus.publish(
        new CreateHistoryEvent(
          profile.id,
          SharedEvents.ProfileUpdatedEvent,
          from,
          to,
        ),
      );
      return updateProfile;
    } catch (error) {
      this.logger.error(
        `Failed to update profile with ID: ${profileId}`,
        error.stack,
      );
      throw error;
    }
  }
}
