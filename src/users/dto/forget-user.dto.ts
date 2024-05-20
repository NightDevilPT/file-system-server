import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    default: 'nightdevilpt@gmail.com',
  })
  email: string;
}
