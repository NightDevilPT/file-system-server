import { Controller, Post, Body, Put, Query } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';  // Ensure you have a service to handle user operations
import { loginUserResponse, userResponseInterface } from './interfaces/user.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgetPasswordUserDto } from './dto/forget-password-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createUser(@Body() createUserDto: CreateUserDto):Promise<userResponseInterface> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async loginUser(@Body() loginDto: LoginUserDto): Promise<loginUserResponse> {
    return this.usersService.loginUser(loginDto)
  }

  @Put('forget-password')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordUserDto): Promise<userResponseInterface> {
    return this.usersService.forgetPassword(forgetPasswordDto)
  }

  @Put('update-password')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 201, description: 'The user password has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updatePassword(
    @Body() forgetPasswordDto: UpdatePasswordUserDto,
    @Query('token') token: string,
  ): Promise<userResponseInterface> {
    return this.usersService.updatePassword(forgetPasswordDto, token);
  }

  @Put('/verify')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async verifyUser(
    @Query('token') token: string
  ): Promise<userResponseInterface> {
    return this.usersService.verifyUser(token);
  }
}
