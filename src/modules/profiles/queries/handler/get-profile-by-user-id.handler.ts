// handlers/create-profile.handler.ts

import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GoneException,
  Logger,
} from '@nestjs/common';
import { ProfileResponse } from '../../interfaces/profile.interfaces';
import { User } from 'src/modules/users/entities/user.entity';
import { GetProfileByUserIdQuery } from '../impl/get-profile-by-user-id.query';

@QueryHandler(GetProfileByUserIdQuery)
export class GetProfileByUserIdHandler
  implements ICommandHandler<GetProfileByUserIdQuery>
{
  private readonly logger = new Logger(GetProfileByUserIdHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: GetProfileByUserIdQuery): Promise<ProfileResponse> {
    const { userId } = command;
    this.logger.log(`Get Profile by UserId : ${userId}`);

    const userData = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!userData.profile) {
      throw new GoneException('Profile not exist');
    }

    return {
      data: userData.profile,
      message: 'profile successfully fetched',
    };
  }
}
