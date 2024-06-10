import {
  Controller,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRequest } from '../profiles/interfaces/profile.interfaces';
import { File } from './entities/file.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateFilePermissionDto } from './dto/update-file-permission.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@ApiTags('File Controller')
@Controller('files')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @Req() req: UserRequest
  ): Promise<File> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.filesService.create(file, createFileDto, userId);
  }

  @Put(':fileId')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a Profile' })
  updateFolder(
    @Body() updateFileDto: UpdateFileDto,
    @Param('fileId') fileId: string,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.filesService.update(updateFileDto, userId, fileId);
  }


  @Put('permission/:fileId')
  @ApiOperation({ summary: 'Create a Profile' })
  updateFolderPermission(
    @Body() updateFilePermissionDto: UpdateFilePermissionDto,
    @Param('fileId') fileId: string,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.filesService.updatePermission(
      updateFilePermissionDto,
      userId,
      fileId,
    );
  }
}
