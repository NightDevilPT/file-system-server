import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileCommand } from './commands/impl/create-profile.command';
import { UpdateProfileCommand } from './commands/impl/update-profile.command';
import { GetProfileByUserIdQuery } from './queries/impl/get-profile-by-user-id.query';
import { ProfileResponse } from './interfaces/profile.interfaces';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  create(createProfileDto: CreateProfileDto, userId: string,file:Express.Multer.File): Promise<Profile> {
    return this.commandBus.execute(
      new CreateProfileCommand(userId, createProfileDto,file),
    );
  }

  findOne(userId: string):Promise<ProfileResponse> {
    return this.queryBus.execute(new GetProfileByUserIdQuery(userId));
  }

  async updateProfile(
    profileId: string,
    payload: UpdateProfileDto,
    file:Express.Multer.File
  ): Promise<Profile> {
    return this.commandBus.execute(
      new UpdateProfileCommand(profileId, payload,file),
    );
  }
}
