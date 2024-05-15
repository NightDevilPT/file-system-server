import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { Profile } from '../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';


export class UpdateProfileCommand implements ICommand {
  constructor(
    public readonly payload: UpdateProfileDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const { payload, userId } = command;

    // Find the profile by its ID
    const profile = await this.profileRepository.findOne({
      where: {
        user: { id: userId },
      },
    });

    // If the profile doesn't exist, throw NotFoundException
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Update the profile fields
    profile.firstname = payload.firstname;
    profile.lastname = payload.lastname;
    profile.gender = payload.gender;
    profile.avatar = payload.avatar;

    // Save the updated profile
    return this.profileRepository.save(profile);
  }
}
