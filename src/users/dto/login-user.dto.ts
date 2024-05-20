import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    default: 'nightdevilpt@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user', default: 'test123' })
  password: string;
}
