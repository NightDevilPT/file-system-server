import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Put
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRequest } from '../profiles/interfaces/profile.interfaces';
import { Folder } from './entities/folder.entity';
import { UpdateFolderPermissionDto } from './dto/update-user-permission.dto';

@ApiTags('Folder Controller')
@Controller('folder')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a Profile' })
  create(
    @Body() createFolderDto: CreateFolderDto,
    @Req() req: UserRequest,
  ): Promise<Folder> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.foldersService.create(createFolderDto, userId);
  }

  @Put(':folderId')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a Profile' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateFolder(
    @Body() updateFolderDto: UpdateFolderDto,
    @Param('folderId') folderId: string,
    @Req() req: UserRequest,
  ): Promise<Folder> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.foldersService.update(updateFolderDto, userId, folderId);
  }

  @Put('permission/:folderId')
  @ApiOperation({ summary: 'Create a Profile' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateFolderPermission(
    @Body() updateFolderPermissionDto: UpdateFolderPermissionDto,
    @Param('folderId') folderId: string,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.foldersService.updatePermission(
      updateFolderPermissionDto,
      userId,
      folderId,
    );
  }
}
