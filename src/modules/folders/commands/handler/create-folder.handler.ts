import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Repository } from 'typeorm';
import { Folder } from '../../entities/folder.entity';
import { CreateFolderCommand } from '../impl/create-folder.command';
import { isUUID } from 'class-validator';
import { PrivateEnum } from 'src/interfaces/enum';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler
  implements ICommandHandler<CreateFolderCommand>
{
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
    const { parentFolderId, ...folderData } = payload;

    try {
      const folder = this.folderRepository.create(folderData);

      if (parentFolderId) {
        if (!isUUID(parentFolderId)) {
          throw new BadRequestException('Invalid parentFolderId UUID');
        }
        const findFolder = await this.folderRepository.findOne({
          where: { id: parentFolderId },
        });
        if (!findFolder) {
          throw new NotFoundException(`Folder not found ${parentFolderId}`);
        }
        folder.parentFolder = findFolder;
        folder.resourceId = findFolder.id;
      } else {
        const findProfile = await this.profileRepository.findOne({
          where: {
            user: {
              id: userId,
            },
          },
        });
        if (!findProfile) {
          throw new NotFoundException(`Profile not found`);
        }
        folder.parentProfile = findProfile;
        folder.resourceId = findProfile.id;
      }

      folder.isAccessable = PrivateEnum.PRIVATE;
      folder.createdBy = userId;

      const savedFolder = await this.folderRepository.save(folder);
      this.logger.log(
        `CreateFolderCommand executed successfully for user ${command.userId}`,
      );
      return savedFolder;
    } catch (error) {
      this.logger.error(
        `Failed to execute CreateFolderCommand for user ${command.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
