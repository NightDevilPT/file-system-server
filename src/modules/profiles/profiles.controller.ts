import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileResponse, UserRequest } from './interfaces/profile.interfaces';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Profile Controller')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get a Profile' })
  async getProfile(@Req() req: UserRequest): Promise<ProfileResponse> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException(`Invalid Token`);
    }
    return this.profilesService.findOne(userId);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: UserRequest,
  ): Promise<Profile> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.profilesService.create(createProfileDto, userId, file);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Param('id') profileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    if (!profileId) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }
    return this.profilesService.updateProfile(
      profileId,
      updateProfileDto,
      file,
    );
  }
}
