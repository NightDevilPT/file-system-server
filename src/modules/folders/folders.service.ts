import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './entities/folder.entity';
import { CreateFolderCommand } from './commands/impl/create-folder.command';
import { UpdateFolderCommand } from './commands/impl/update-folder.command';
import { UpdateFolderPermissionDto } from './dto/update-user-permission.dto';
import { UpdateFolderPermissionCommand } from './commands/impl/update-folder-permission.command';

@Injectable()
export class FoldersService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(
    createFolderDto: CreateFolderDto,
    userId: string,
  ): Promise<Folder> {
    return this.commandBus.execute(
      new CreateFolderCommand(createFolderDto, userId),
    );
  }

  async update(
    updateFolderDto: UpdateFolderDto,
    userId: string,
    folderId: string,
  ): Promise<Folder> {
    return this.commandBus.execute(
      new UpdateFolderCommand(updateFolderDto, userId, folderId),
    );
  }

  async updatePermission(
    updateFolderPermissionDto: UpdateFolderPermissionDto,
    userId: string,
    folderId: string,
  ): Promise<Folder> {
    return this.commandBus.execute(
      new UpdateFolderPermissionCommand(updateFolderPermissionDto, userId, folderId),
    );
  }
}
