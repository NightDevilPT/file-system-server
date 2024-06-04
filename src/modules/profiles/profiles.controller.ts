import { Controller, Get, Post, Body, Param, UseGuards, Req, UnauthorizedException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileResponse, UserRequest } from './interfaces/profile.interfaces';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile Controller')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get a Profile' })
  async getProfile(@Req() req:UserRequest): Promise<ProfileResponse> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException(`Invalid Token`);
    }
    return this.profilesService.findOne(userId);
  }

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a Profile' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createProfileDto: CreateProfileDto,@Req() req:UserRequest):Promise<Profile> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in the request');
    }
    return this.profilesService.create(createProfileDto,userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Profile' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(@Param('id') profileId: string, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    if (!profileId) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }
    return this.profilesService.updateProfile(profileId,updateProfileDto)
  }
}

