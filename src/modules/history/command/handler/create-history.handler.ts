import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateHistoryCommand } from '../impl/create-history.command';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from '../../entities/history.entity';
import { Repository } from 'typeorm';
import { SharedEvents } from 'src/modules/command-events/events';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { File } from 'src/modules/files/entities/file.entity';

@CommandHandler(CreateHistoryCommand)
export class CreateHistoryHandler
  implements ICommandHandler<CreateHistoryCommand>
{
  constructor(
    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async execute(command: CreateHistoryCommand): Promise<void> {
    const { resourceId, eventName, from, to } = command;
    const historyPayload = new History();
    historyPayload.eventName = eventName;
    historyPayload.resourceId = resourceId;
    if (
      eventName === SharedEvents.ProfileCreatedEvent ||
      eventName === SharedEvents.ProfileUpdatedEvent
    ) {
      historyPayload.userId = await this.getUserIdFromProfile(resourceId);
    } else if (
      eventName === SharedEvents.FolderCreatedEvent ||
      eventName === SharedEvents.FolderMovedEvent ||
      eventName === SharedEvents.FolderNameChangedEvent ||
      eventName === SharedEvents.FolderPermissionChangedEvent
    ) {
      historyPayload.userId = await this.getUserIdFromFolder(resourceId);
    } else if (
      eventName === SharedEvents.FileCreatedEvent ||
      eventName === SharedEvents.FileMovedEvent ||
      eventName === SharedEvents.FileNameChangedEvent ||
      eventName === SharedEvents.FilePermissionChangedEvent
    ) {
      historyPayload.userId = await this.getUserIdFromFile(resourceId);
    } else {
      historyPayload.userId = resourceId;
    }
    if (from) {
      historyPayload.from = from;
    }
    if (to) {
      historyPayload.to = to;
    }
    this.historyRepo.save(historyPayload);
  }

  async getUserIdFromProfile(id: string) {
    const findUser = await this.profileRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    return findUser.user.id;
  }

  async getUserIdFromFolder(id: string) {
    const findUser = await this.folderRepo.findOne({
      where: {
        id,
      },
    });

    return findUser.createdBy;
  }

  async getUserIdFromFile(id: string) {
    const findUser = await this.fileRepo.findOne({
      where: {
        id,
      },
    });

    return findUser.createdBy;
  }
}
