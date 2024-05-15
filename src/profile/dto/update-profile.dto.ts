import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'The first name of the user', default: 'John' })
  @IsOptional()
  firstname?: string;

  @ApiProperty({ description: 'The last name of the user', default: 'Doe' })
  @IsOptional()
  lastname?: string;

  @ApiProperty({ description: 'The gender of the user', default: 'male' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ description: 'The avatar URL of the user', default: null })
  @IsOptional()
  avatar?: string;
}
