// src/cone/handlers/get-folder-by-id.handler.ts
import {
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder, PrivateEnum } from '../../entities/folder.entity';

import { GetFolderByIdQuery } from '../impl/get-folder-by-id.command';
import { isUUID } from 'class-validator';
import { NotFoundException } from '@nestjs/common/exceptions';

@QueryHandler(GetFolderByIdQuery)
export class GetFolderByIdHandler implements IQueryHandler<GetFolderByIdQuery> {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async execute(
    query: GetFolderByIdQuery,
  ): Promise<Folder | { message: string }> {
    const { folderId, userId } = query;

    // Check if folderId is a valid UUID
    if (!isUUID(folderId)) {
      throw new NotFoundException(`Invalid folder ID: ${folderId}`);
    }

    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    if (folder.isPrivate === PrivateEnum.PRIVATE) {
      return {
        message: `you don't have a permission to access this file`,
      };
    } else if (folder.isPrivate === PrivateEnum.ONLY) {
      if (folder.userIds.includes(userId)) {
        return folder;
      } else {
        return {
          message: `you don't have a permission to access this file`,
        };
      }
    }

    return folder;
  }
}
