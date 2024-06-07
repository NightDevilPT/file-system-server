import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Folder } from '../../entities/folder.entity';
import { UpdateFolderCommand } from '../impl/update-folder.command';

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderHandler
  implements ICommandHandler<UpdateFolderCommand>
{
  private readonly logger = new Logger(UpdateFolderHandler.name);

  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: UpdateFolderCommand): Promise<Folder> {
    this.logger.log(
      `Executing UpdateFolderCommand for folder ${command.folderId} by user ${command.userId}`,
    );

    const { payload, userId, folderId } = command;
    const {
      parentFolderId,
      parentProfileId,
      ...folderData
    } = payload;

    try {
      const folder = await this.folderRepository.findOne({
        where: { id: folderId },
      });

      if (!folder) {
        throw new Error('Folder not found');
      }

      Object.assign(folder, folderData);

      if (parentFolderId) {
        folder.parentFolder = await this.folderRepository.findOne({
          where: { id: parentFolderId },
        });
        folder.parentProfile = null;
      } else if (parentProfileId) {
        folder.parentProfile = await this.profileRepository.findOne({
          where: { id: parentProfileId },
        });
        folder.parentFolder = null;
      }

      const updatedFolder = await this.folderRepository.save(folder);
      this.logger.log(
        `UpdateFolderCommand executed successfully for folder ${command.folderId}`,
      );
      return updatedFolder;
    } catch (error) {
      this.logger.error(
        `Failed to execute UpdateFolderCommand for folder ${command.folderId}`,
        error.stack,
      );
      throw error;
    }
  }
}
