import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Repository } from 'typeorm';
import { Folder } from '../../entities/folder.entity';
import { CreateFolderCommand } from '../impl/create-folder.command';
import { isUUID } from 'class-validator';
import { PrivateEnum } from 'src/interfaces/enum';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { v4 as uuidv4 } from 'uuid';

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
    private readonly hashService: HashPasswordService,
  ) {}

  async execute(command: CreateFolderCommand): Promise<Folder> {
    this.logger.log(`Executing CreateFolderCommand for user ${command.userId}`);

    const { payload, userId } = command;
    const { parentFolderId, ...folderData } = payload;

    try {
      const folder = this.folderRepository.create({...folderData,id: uuidv4()});

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
        folder.breadcrumb = [...findFolder.breadcrumb,{ name: folder.name, id: folder.id }];
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
        folder.resourceId = userId;
        folder.breadcrumb = [{ name: folder.name, id: folder.id }];
      }

      folder.isAccessable = PrivateEnum.PRIVATE;
      folder.createdBy = userId;
      folder.shareToken = await this.hashService.hashPassword(
        `${new Date().getTime()}`,
      )+':FOLDER';

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