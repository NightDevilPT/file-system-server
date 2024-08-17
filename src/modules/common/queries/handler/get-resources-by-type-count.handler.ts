import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, FileTypeEnum } from 'src/modules/files/entities/file.entity';
import { FolderEnum, PrivateEnum } from 'src/interfaces/enum';
import { GetResourcesTypeCountQuery } from '../impl/get-resources-by-type-count.query';

@Injectable()
@QueryHandler(GetResourcesTypeCountQuery)
export class GetResourcesTypeCountHandler
  implements IQueryHandler<GetResourcesTypeCountQuery>
{
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async execute(query: GetResourcesTypeCountQuery): Promise<any> {
    const { userId } = query;

    try {
      const files = await this.fileRepository.find({
        where: { createdBy: userId, type: FolderEnum.FILE },
      });

      // Initialize counters for each file type and 'other'
      const fileTypeCount = {
        image: 0,
        document: 0,
        video: 0,
        other: 0,
      };

      // Count files by fileType
      files.forEach((file) => {
        switch (file.fileType) {
          case FileTypeEnum.IMAGE:
            fileTypeCount.image++;
            break;
          case FileTypeEnum.DOCUMENT:
            fileTypeCount.document++;
            break;
          case FileTypeEnum.VIDEO:
            fileTypeCount.video++;
            break;
          default:
            fileTypeCount.other++;
        }
      });

      return fileTypeCount;
    } catch (error) {
      console.error(
        'Error executing GetResourcesTypeCountQuery:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to get resources type count',
      );
    }
  }
}
