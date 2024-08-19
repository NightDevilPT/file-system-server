import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Logger } from '@nestjs/common';
import { Profile } from '../../entities/profile.entity';
import { CreateProfileCommand } from '../impl/create-profile.command';
import {
  ProfileResponse,
  StorageType,
} from '../../interfaces/profile.interfaces';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from 'src/services/firebase-service/firebase.service';

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
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async execute(command: CreateProfileCommand): Promise<ProfileResponse> {
    const { payload, userId, file } = command;
    this.logger.log(`Creating New profile : ${JSON.stringify(payload)}`);

    const userData = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (userData.profile) {
      throw new ConflictException('User already has a profile');
    }

    let avatarUrl: string | null = null;
    if (file) {
      // Upload the avatar file to Firebase and get the URL
      avatarUrl = await this.firebaseService.uploadAvtar(file);
    }

    const createProfile = this.profileRepository.create({
      ...payload,
      storageSize:
        this.configService.get<number>('TOTAL_STORAGE_SIZE') || 51200,
      upgraded: StorageType.DEFAULT,
      user: userData,
      avatar: avatarUrl,
      allAvatar: avatarUrl ? [avatarUrl] : [], // Add the avatar URL to allAvatar array
    });

    const saveProfile = await this.profileRepository.save(createProfile);

    this.eventBus.publish(
      new CreateHistoryEvent(saveProfile.id, SharedEvents.ProfileCreatedEvent),
    );

    return {
      data: saveProfile,
      message: 'Profile successfully created',
    };
  }
}
