import {
  Controller,
  Query,
  Get,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BffService } from './bff.service';
import { FilterDto, QueryDto } from './dtos/query.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRequest } from '../profiles/interfaces/profile.interfaces';

@ApiTags('Bff Controller')
@Controller('bff')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @Get('resource/:resourceId')
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
  async getResourceByIdData(
    @Param('resourceId') resourceId: string,
    @Query('filters') filters: string,
    @Query('sort') sort: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: UserRequest,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    const query: QueryDto = {
      resourceId,
      filters,
      sort,
      page,
      limit,
    };

    return this.bffService.getResourceByIdData(query, userId);
  }

  @Get('/share-resource/:token')
  getResourceByToken(@Param('token') token: string, @Req() req: UserRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.bffService.getResourceByTokenData(token, userId);
  }

  @Get('count')
  async getResourcesTypeCount(@Req() req: UserRequest) {
    const userId = req?.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }

    return this.bffService.getResourcesTypeCount(userId);
  }
}
