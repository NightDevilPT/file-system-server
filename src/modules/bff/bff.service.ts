import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { QueryDto } from './dtos/query.dto';
import { GetResourcesQuery } from './queries/impl/get-resources.query';
import { GetResourceByTokenQuery } from './queries/impl/get-resource-by-token.query';
import { GetResourcesTypeCountQuery } from './queries/impl/get-resources-by-type-count.query';

@Injectable()
export class BffService {
  constructor(private readonly queryBus: QueryBus) {}

  getResourceByIdData(query: QueryDto, userId: string) {
    return this.queryBus.execute(new GetResourcesQuery(query,userId));
  }

  getResourceByTokenData(token:string,userId: string) {
    return this.queryBus.execute(new GetResourceByTokenQuery(token,userId));
  }

  getResourcesTypeCount(userId: string) {
    return this.queryBus.execute(new GetResourcesTypeCountQuery(userId));
  }
}
