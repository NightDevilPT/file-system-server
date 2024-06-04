import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from '../interfaces/profile.interfaces';

export class CreateProfileDto {
  @ApiProperty({
    example: 'John',
    default: 'John',
    description: 'First name of the profile',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    default: 'Doe',
    description: 'Last name of the profile',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: GenderEnum.MALE,
    default: GenderEnum.MALE,
    enum: GenderEnum,
    description: 'Gender of the profile',
  })
  @IsEnum(GenderEnum)
  gender: string;
}
