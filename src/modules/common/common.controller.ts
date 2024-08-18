import {
  Controller,
  Query,
  Get,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CommonService } from './common.service';
import { QueryDto } from './dtos/query.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRequest } from '../profiles/interfaces/profile.interfaces';

@ApiTags('Common Controller')
@Controller('common')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BffController {
  constructor(private readonly bffService: CommonService) {}

  @Get('resource/:resourceId')
  @ApiOperation({
    summary: 'Get resources by Resource ID',
    description: `Fetches resources (folders/files) associated with a specific resourceId. 
    The resourceId acts as a parentId, with the folders and files being the child resources.`,
  })
  @ApiParam({
    name: 'resourceId',
    type: 'string',
    description: 'The ID of the resource (parent folder or file).',
  })
  @ApiQuery({
    name: 'filters',
    type: 'string',
    required: false,
    description: 'Optional string to filter the results.',
  })
  @ApiQuery({
    name: 'sort',
    type: 'string',
    required: false,
    description: 'Optional sorting criteria for the query.',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Optional page number for pagination. Defaults to 1.',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Optional limit for the number of results per page. Defaults to 10.',
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
  @ApiOperation({
    summary: 'Get resource by token',
    description: `Fetches a resource shared via a token. The token is a unique identifier 
    allowing access to the resource, even without direct resource ID.`,
  })
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'The token used to identify and access the shared resource.',
  })
  async getResourceByToken(@Param('token') token: string, @Req() req: UserRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.bffService.getResourceByTokenData(token, userId);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get count of different resource types',
    description: `Returns the count of different types of resources (images, files, videos, etc.) 
    uploaded by the user. Useful for providing an overview of the user's resource usage.`,
  })
  async getResourcesTypeCount(@Req() req: UserRequest) {
    const userId = req?.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }

    return this.bffService.getResourcesTypeCount(userId);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get user history',
    description: `Returns the history of actions performed by the user. 
    The history includes various actions with pagination support.`,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Page number for pagination. Defaults to 1.',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of results per page. Defaults to 10.',
  })
  async getHistory(
    @Req() req: UserRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req?.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }

    return this.bffService.getHistory(userId, page, limit);
  }
}
