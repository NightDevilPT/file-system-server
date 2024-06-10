import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, GoneException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Folder } from '../../entities/folder.entity';
import { UpdateFolderPermissionCommand } from '../impl/update-folder-permission.command';
import { isUUID } from 'class-validator';

@CommandHandler(UpdateFolderPermissionCommand)
export class UpdateFolderPermissionHandler
  implements ICommandHandler<UpdateFolderPermissionCommand>
{
  private readonly logger = new Logger(UpdateFolderPermissionHandler.name);

  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async execute(command: UpdateFolderPermissionCommand): Promise<Folder> {
    this.logger.log(
      `Executing UpdateFolderPermissionCommand for user ${command.userId}`);

    const { payload, userId, folderId } = command;
    const { isPrivate, userIds } = payload;

    if (!isUUID(folderId)) {
      throw new BadRequestException(`Invalid UUID format: ${folderId}`);
    }

    try {
      const folder = await this.folderRepository.findOne({
        where: { id: folderId },
      });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      if (isPrivate !== undefined) {
        folder.isAccessable = isPrivate;
      }

      if (folder.createdBy !== userId) {
        throw new GoneException(
          `You don't have a permission to change Folder/File permission`,
        );
      }

      if (isPrivate === 'ONLY' && Array.isArray(userIds)) {
        const newUserSet = userIds.filter((items) => items !== userId);
        folder.userIds = [...newUserSet];
      }

      const updatedFolder = await this.folderRepository.save(folder);
      this.logger.log(
        `UpdateFolderPermissionCommand executed successfully for user ${command.userId}`,
      );
      return updatedFolder;
    } catch (error) {
      this.logger.error(
        `Failed to execute UpdateFolderPermissionCommand for user ${command.userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
