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
  ApiConsumes,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { SessionGuard } from 'src/guards/session.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponse, UserRequest } from './interfaces/profile.interfaces';

@ApiTags('Profile Controller')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@Controller('profiles')
@UseGuards(SessionGuard)
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
