// create-profile.handler.ts
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Profile } from '../entities/profile.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';

export class CreateProfileCommand implements ICommand {
  constructor(
    public readonly payload: CreateProfileDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateProfileCommand): Promise<Profile> {
    const { payload, userId } = command;

    const profile = new Profile();
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['id', 'username', 'email', 'provider', 'isVerified', 'token'],
    });
    profile.firstname = payload.firstname;
    profile.lastname = payload.lastname;
    profile.gender = payload.gender;
    profile.avatar = payload.avatar;
    profile.user = user;

    // Save the profile to the database
    const newProfile = await this.profileRepository.save(profile);
    return newProfile;
  }
}
