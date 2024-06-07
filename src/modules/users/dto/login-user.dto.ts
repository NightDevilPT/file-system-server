import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'nightdevilpt@gmail.com', default:'nightdevilpt@gmail.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test123', default:'test123', description: 'User password' })
  @IsNotEmpty()
  password: string;
}
