import { UpdateFolderDto } from '../dto/update-folder.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder, ParentType } from '../entities/folder.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  NotFoundException,
  BadRequestException,
  GoneException,
} from '@nestjs/common';

export class UpdateFolderCommand {
  constructor(
    public readonly payload: UpdateFolderDto,
    public readonly folderId: string,
    public readonly parentId: string,
  ) {}
}

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderHandler
  implements ICommandHandler<UpdateFolderCommand>
{
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: UpdateFolderCommand): Promise<Folder> {
    const { payload, folderId, parentId } = command;
    const { parentType, type, title, parentFolder } = payload;

    // Fetch the folder to be updated using folderId
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });
    if (!folder) {
      throw new NotFoundException(`Folder with id ${folderId} not found`);
    }

    // Update folder properties if provided
    if (parentType !== undefined) {
      folder.parentType = parentType;
    }
    if (type !== undefined) {
      folder.type = type;
    }
    if (title !== undefined) {
      folder.title = title;
    }

    folder.updatedBy = parentId;

    try {
      // Handle parentFolder relationship
      if (parentFolder) {
        const parentFolderEntity = await this.folderRepository.findOne({
          where: { id: parentFolder },
        });
        if (!parentFolderEntity) {
          throw new BadRequestException(
            `Parent folder with id ${parentFolder} not found`,
          );
        }
        folder.parentFolder = parentFolderEntity;
        folder.parentProfile = null;
      } else if (parentType === ParentType.PROFILE) {
        // Handle parentProfile relationship if parentFolder is not provided
        const parentProfile = await this.profileRepository.findOne({
          where: { user: { id: parentId } },
        });
        if (!parentProfile) {
          throw new BadRequestException(
            `Profile with id ${parentId} not found`,
          );
        }
        folder.parentProfile = parentProfile;
        folder.parentFolder = null;
      }

      return await this.folderRepository.save(folder);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new GoneException('An error occurred while creating the folder');
      }
    }
  }
}
