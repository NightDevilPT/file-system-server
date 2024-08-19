import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from '../interfaces/profile.interfaces';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the profile',
	required:false
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the profile',
	required:false
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'Avtar',
    description: 'Select Avtar URL',
	required:false
  })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    example: GenderEnum.MALE,
    default: GenderEnum.MALE,
    enum: GenderEnum,
    description: 'Gender of the profile',
	required:false
  })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: string;

  @ApiProperty({ type: 'string', format: 'binary',
	required:false })
  @Type(() => Object)
  @IsOptional()
  file: Express.Multer.File;
}
