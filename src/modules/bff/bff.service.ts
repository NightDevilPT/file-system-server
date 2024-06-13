import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { QueryDto } from './dtos/query.dto';
import { GetResourcesQuery } from './queries/impl/get-resources.query';

@Injectable()
export class BffService {
  constructor(private readonly queryBus: QueryBus) {}

  getData(query: QueryDto, userId: string) {
    return this.queryBus.execute(new GetResourcesQuery(query,userId));
  }
}
