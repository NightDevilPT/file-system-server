import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Profile } from '../../entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileCommand } from '../impl/update-profile.command';
import { getChangedFields } from 'src/utils/diff-utils';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';
import { FirebaseService } from 'src/services/firebase-service/firebase.service';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  private readonly logger = new Logger(UpdateProfileHandler.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly eventBus: EventBus,
    private readonly firebaseService: FirebaseService,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const { profileId, payload, file } = command;

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

      if (payload.avatar) {
        profile.avatar = payload.avatar;
      }

      // If a file is provided, upload it and update the avatar fields
      if (file) {
        const avatarUrl = await this.firebaseService.uploadAvtar(file);

        // Include avatar in the change detection
        from.avatar = profile.avatar;
        to.avatar = avatarUrl;

        profile.avatar = avatarUrl;
        profile.allAvatar = [...(profile.allAvatar || []), avatarUrl];
      }

      const updatedProfile = await this.profileRepository.save(profile);
      this.eventBus.publish(
        new CreateHistoryEvent(
          profile.id,
          SharedEvents.ProfileUpdatedEvent,
          from,
          to,
        ),
      );

      return updatedProfile;
    } catch (error) {
      this.logger.error(
        `Failed to update profile with ID: ${profileId}`,
        error.stack,
      );
      throw error;
    }
  }
}
