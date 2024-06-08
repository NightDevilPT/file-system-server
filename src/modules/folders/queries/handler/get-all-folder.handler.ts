// src/cone/handlers/get-all-folders.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../../entities/folder.entity';
import { GetFoldersQuery } from '../impl/get-all-folder.command';

export interface FolderResponse {
  data: Folder[];
  meta: {
    page: number;
    next: number | null;
    prev: number | null;
    totalPages: number;
    totalResults: number;
  };
}

@QueryHandler(GetFoldersQuery)
export class GetFoldersHandler implements IQueryHandler<GetFoldersQuery> {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async execute(query: GetFoldersQuery): Promise<FolderResponse> {
    const { page, limit } = query;

    const [folders, totalResults] = await this.folderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalResults / limit);

    return {
      data: folders,
      meta: {
        page: Number(page),
        next: page < totalPages ? Number(page) + 1 : null,
        prev: page > 1 ? Number(page) - 1 : null,
        totalPages,
        totalResults,
      },
    };
  }
}
