import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/modules/files/entities/file.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { GetResourcesQuery } from '../impl/get-resources.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetResourcesQuery)
export class GetResourcesHandler implements IQueryHandler<GetResourcesQuery> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
  ) {}

  async execute({ payload }: GetResourcesQuery) {
    const { filters, sort, limit, resourceId } = payload;
    const page = Number(payload.page);

    const [column, order]: [string, 'ASC' | 'DESC'] = sort
      ? (sort.split(':') as [string, 'ASC' | 'DESC'])
      : ['createdAt', 'ASC'];
    const skip = (page - 1) * limit;

    // Prepare filter
    const filterQuery = filters ? { filter: `%${filters}%` } : {};

    // Fetch folders
    const folderQuery = this.folderRepo
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.parentFolder', 'parentFolder')
      .leftJoinAndSelect('folder.parentProfile', 'parentProfile')
      .where('folder.resourceId = :resourceId', { resourceId })
      .andWhere(filters ? 'folder.name LIKE :filter' : '1=1', filterQuery)
      .orderBy(`folder.${column}`, order)
      .skip(skip)
      .take(limit);
    const folders = await folderQuery.getMany();

    // Fetch total folder count
    const folderCount = await this.folderRepo.count({
      where: {
        resourceId,
        name: filters ? Like(`%${filters}%`) : Like('%'),
      },
    });

    // Fetch files
    const fileQuery = this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.parentFolder', 'parentFolder')
      .leftJoinAndSelect('file.parentProfile', 'parentProfile')
      .where('file.resourceId = :resourceId', { resourceId })
      .andWhere(filters ? 'file.name LIKE :filter' : '1=1', filterQuery)
      .orderBy(`file.${column}`, order)
      .skip(skip)
      .take(limit);
    const files = await fileQuery.getMany();

    // Fetch total file count
    const fileCount = await this.fileRepo.count({
      where: {
        resourceId,
        name: filters ? Like(`%${filters}%`) : Like('%'),
      },
    });

    // Calculate metadata
    const totalResults = folders.length + files.length;
    const totalPages = Math.ceil(totalResults / limit);
    const hasNext = ((page * limit) < totalResults) && (folders.length > 0 || files.length > 0);
    const nextPage = hasNext ? page + 1 : null;
    const hasPrevious = page > 1;
    const previousPage = hasPrevious ? page - 1 : null;

    return {
      folders,
      files,
      metadata: {
        totalResults,
        totalPages,
        nextPage,
        previousPage,
        folderCount,
        fileCount,
      },
    };
  }
}
