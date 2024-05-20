import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

import { FolderService } from './folder.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/profile/profile.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Folder')
@ApiTags('Folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateFolderDto })
  @ApiResponse({ status: 201, description: 'Folder created successfully' })
  createProfile(
    @Body() createFolderDto: CreateFolderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.folderService.createFolder(createFolderDto, userId);
  }

  @Put('/update/:folderId')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateFolderDto })
  @ApiResponse({ status: 200, description: 'Folder updated successfully' })
  updateFolder(
    @Param('folderId') folderId: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.folderService.updateFolder(updateFolderDto, folderId, userId);
  }
}
