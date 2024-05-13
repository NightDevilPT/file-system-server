import { Controller, Get, Post, Body, Put, Query } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { loginResponse, verificationResponse, verificationSuccessResponse } from './user.interface';

import { ApiTags, ApiResponse, ApiCreatedResponse, ApiParam, ApiNotFoundResponse, ApiQuery, ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @ApiResponse({ status: 201, description: 'User successfully created', type: User })
  @ApiCreatedResponse({ description: 'The user has been successfully created.', type: User })
  create(@Body() createUserDto: CreateUserDto):Promise<verificationResponse> {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid login credentials' })
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<loginResponse> {
    return this.usersService.loginUser(loginUserDto)
  }

  @Put('/verify')
  @ApiQuery({ name: 'token', description: 'The token of the user to update' })
  @ApiNotFoundResponse({ description: 'User not found' })
  updateUser(@Query('token') token: string): Promise<verificationSuccessResponse> {
    return this.usersService.verifyUser(token)
  }
}
