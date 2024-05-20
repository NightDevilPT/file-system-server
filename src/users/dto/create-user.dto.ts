import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The username of the user', default: 'Abc' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    default: 'nightdevilpt@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user', default: 'test123' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The Provider of the user',
    default: Provider.Local,
  })
  provider: Provider;
}
