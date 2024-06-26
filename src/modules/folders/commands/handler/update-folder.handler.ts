import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Folder } from '../../entities/folder.entity';
import { UpdateFolderCommand } from '../impl/update-folder.command';
import { isUUID } from 'class-validator';

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
    const { parentFolderId, name } = payload;

    try {
      const folder = await this.folderRepository.findOne({
        where: { id: folderId },
      });

      if (!folder) {
        throw new Error('Folder not found');
      }

      if (name && name.length > 0) {
        folder.name = name;
      }

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
        folder.parentProfile = null;
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
