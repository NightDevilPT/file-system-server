import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Repository } from 'typeorm';
import { Folder, PrivateEnum } from '../../entities/folder.entity';
import { CreateFolderCommand } from '../impl/create-folder.command';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler implements ICommandHandler<CreateFolderCommand> {
  private readonly logger = new Logger(CreateFolderHandler.name);

  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: CreateFolderCommand): Promise<Folder> {
    this.logger.log(`Executing CreateFolderCommand for user ${command.userId}`);

    const { payload, userId } = command;
    const { parentFolderId, parentProfileId, ...folderData } = payload;

    try {
      const folder = this.folderRepository.create(folderData);

      if (parentFolderId) {
        folder.parentFolder = await this.folderRepository.findOne({
          where: { id: parentFolderId },
        });
      } else if (parentProfileId) {
        folder.parentProfile = await this.profileRepository.findOne({
          where: { id: parentProfileId },
        });
      } else {
        folder.parentProfile = await this.profileRepository.findOne({
          where: {
            user: {
              id: userId,
            },
          },
        });
      }

	    folder.isPrivate = PrivateEnum.PUBLIC;

      const savedFolder = await this.folderRepository.save(folder);
      this.logger.log(`CreateFolderCommand executed successfully for user ${command.userId}`);
      return savedFolder;
    } catch (error) {
      this.logger.error(`Failed to execute CreateFolderCommand for user ${command.userId}`, error.stack);
      throw error;
    }
  }
}
