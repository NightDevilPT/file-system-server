import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateFolderCommand } from './commands/create-folder.command';
import { UpdateFolderCommand } from './commands/update-folder.command';

@Injectable()
export class FolderService {
  constructor(private commandBus: CommandBus) {}
  createFolder(payload: CreateFolderDto, parentId: string) {
    return this.commandBus.execute(new CreateFolderCommand(payload, parentId));
  }

  updateFolder(payload: UpdateFolderDto, folderId: string, parentId: string) {
    return this.commandBus.execute(
      new UpdateFolderCommand(payload, folderId, parentId),
    );
  }
}
