// handlers/update-profile.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Profile } from '../../entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileCommand } from '../impl/update-profile.command';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  private readonly logger = new Logger(UpdateProfileHandler.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
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

      if (payload.firstName) {
        profile.firstName = payload.firstName;
      }
      if (payload.lastName) {
        profile.lastName = payload.lastName;
      }
      if (payload.gender) {
        profile.gender = payload.gender;
      }

      return this.profileRepository.save(profile);
    } catch (error) {
      this.logger.error(
        `Failed to update profile with ID: ${profileId}`,
        error.stack,
      );
      throw error;
    }
  }
}
