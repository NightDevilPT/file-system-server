import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { ProfileService } from './profile.service';
import { AuthenticatedRequest } from './profile.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { Profile } from './entities/profile.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Profile> {
    const userId = req.user.id;
    return this.profileService.createProfile(createProfileDto, userId);
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard) // Apply JWT guard
  @ApiBody({ type: UpdateProfileDto }) // Swagger body documentation
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Profile> {
    const userId = req.user.id;
    return this.profileService.updateProfile(updateProfileDto, userId);
  }
}
