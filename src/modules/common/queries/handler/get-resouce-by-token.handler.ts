import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/modules/files/entities/file.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { GetResourceByTokenQuery } from '../impl/get-resource-by-token.query';
import { PrivateEnum } from 'src/interfaces/enum';

@Injectable()
@QueryHandler(GetResourceByTokenQuery)
export class GetResourceByTokenHandler
  implements IQueryHandler<GetResourceByTokenQuery>
{
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async execute(query: GetResourceByTokenQuery): Promise<any> {
    const { token, userId } = query;
    const [, resourceType] = token.split(':');
    let resource;

    if (resourceType === 'FOLDER') {
      resource = await this.folderRepository.findOne({
        where: { shareToken: token },
      });
    } else {
      // If not found as a folder, try to find as a file
      resource = await this.fileRepository.findOne({
        where: { shareToken: token },
      });
    }

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.isAccessable === PrivateEnum.PRIVATE) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    if (resource.isAccessable === PrivateEnum.ONLY) {
      if (!resource.userIds || !resource.userIds.includes(userId)) {
        throw new ForbiddenException('You do not have access to this resource');
      }
    }
    return resource;
  }
}
