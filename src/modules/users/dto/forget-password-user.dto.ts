import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordUserDto {
  @ApiProperty({ example: 'nightdevilpt@gamil.com', description: 'User email' })
  @IsEmail()
  email: string;
}
