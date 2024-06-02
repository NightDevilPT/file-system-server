import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'nightdevilpt@gamil.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'text123', description: 'User password' })
  @IsNotEmpty()
  password: string;
}
