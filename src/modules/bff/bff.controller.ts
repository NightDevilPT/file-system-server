import { Controller, Query, Get, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BffService } from './bff.service';
import { FilterDto, QueryDto } from './dtos/query.dto';

@ApiTags('Bff Controller')
@Controller('bff')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @Get(':resourceId')
  @ApiQuery({
    name: 'filters',
    type: 'string',
    required: false,
    description: 'Filters to apply to the query',
  })
  @ApiQuery({
    name: 'sort',
    type: 'string',
    required: false,
    description: 'Sorting criteria for the query',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Sorting criteria for the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Sorting criteria for the query',
  })
  async getData(
    @Param('resourceId') resourceId: string,
    @Query('filters') filters:string,
    @Query('sort') sort: string,
    @Query('page') page: number=1,
    @Query('limit') limit: number=10,
  ) {
    const query: QueryDto = {
      resourceId,
      filters,
      sort,
      page,
      limit
    };

    return this.bffService.getData(query);
  }
}
