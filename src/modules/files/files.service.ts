import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateFileCommand } from './commands/impl/create-file.command';
import { UpdateFilePermissionDto } from './dto/update-file-permission.dto';
import { UpdateFilePermissionCommand } from './commands/impl/update-file-permission.command';
import { UpdateFileDto } from './dto/update-file.dto';
import { UpdateFileCommand } from './commands/impl/update-file.command';

@Injectable()
export class FilesService {
  constructor(private readonly commandBus: CommandBus) {}
  create(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
    userId: string,
  ) {
    return this.commandBus.execute(
      new CreateFileCommand(file, createFileDto, userId),
    );
  }

  async update(updateFileDto: UpdateFileDto, userId: string, fileId: string) {
    return this.commandBus.execute(
      new UpdateFileCommand(updateFileDto, userId, fileId),
    );
  }

  async updatePermission(
    updateFilePermissionDto: UpdateFilePermissionDto,
    userId: string,
    fileId: string,
  ) {
    return this.commandBus.execute(
      new UpdateFilePermissionCommand(updateFilePermissionDto, userId, fileId),
    );
  }
}
