import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { File } from '../../entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFileCommand } from '../impl/update-file.command';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateFileCommand)
export class UpdateFileHandler implements ICommandHandler<UpdateFileCommand> {
  private readonly logger = new Logger(UpdateFileHandler.name);

  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: UpdateFileCommand) {
    this.logger.log(
      `Executing UpdateFileCommand for File ${command.fileId} by user ${command.userId}`,
    );

    const { payload, userId, fileId } = command;
    const { parentFolderId, name } = payload;

    try {
      const file = await this.fileRepo.findOne({
        where: { id: fileId },
      });
      console.log(fileId, 'FILEDATA');

      if (!file) {
        throw new Error('Folder not found');
      }

      if (name && name.length > 0) {
        file.name = name;
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
        file.parentFolder = findFolder;
        file.resourceId = findFolder.id;
        file.parentProfile = null;
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
        file.parentProfile = findProfile;
        file.resourceId = findProfile.id;
        file.parentFolder = null;
      }

      const updatedFolder = await this.fileRepo.save(file);
      this.logger.log(
        `UpdateFolderCommand executed successfully for folder ${command.fileId}`,
      );
      return { file: updatedFolder };
    } catch (error) {
      this.logger.error(
        `Failed to execute UpdateFolderCommand for folder ${command.fileId}`,
        error.stack,
      );
      throw error;
    }
  }
}
