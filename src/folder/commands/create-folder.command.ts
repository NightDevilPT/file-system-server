import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, GoneException } from '@nestjs/common';

import { Profile } from 'src/profile/entities/profile.entity';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { Folder, ParentType } from '../entities/folder.entity';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateFolderCommand {
  constructor(
    public readonly payload: CreateFolderDto,
    public readonly parentId: string,
  ) {}
}

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler
  implements ICommandHandler<CreateFolderCommand>
{
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: CreateFolderCommand): Promise<Folder> {
    const { payload, parentId } = command;
    const { parentType, type, title, parentFolder } = payload;

    const folderModel = new Folder();
    folderModel.title = title;
    folderModel.type = type;
    folderModel.parentType = ParentType.FOLDER;
    folderModel.createdBy = parentId;
    folderModel.updatedBy = parentId;

    try {
      if (parentFolder) {
        const parentFolderEntity = await this.folderRepository.findOne({
          where: { id: parentFolder },
        });
        if (!parentFolderEntity) {
          throw new Error(`Folder with id ${parentFolder} not found`);
        }
        folderModel.parentFolder = parentFolderEntity;
        folderModel.parentType = ParentType.FOLDER;
      } else if (parentType === ParentType.PROFILE) {
        const parentProfile = await this.profileRepository.findOne({
          where: { user: { id: parentId } },
        });
        if (!parentProfile) {
          throw new Error(`Profile with id ${parentId} not found`);
        }
        folderModel.parentProfile = parentProfile;
      }

      return await this.folderRepository.save(folderModel);
    } catch (err) {
      console.log(err, '+++++=');
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new GoneException('An error occurred while creating the folder');
      }
    }
  }
}
