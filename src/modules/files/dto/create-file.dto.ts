import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFileDto {
  @ApiProperty({ description: 'Name of the file' })
  name: string;

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  @IsString()
  parentFolderId?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @Type(() => Object)
  file: Express.Multer.File;
}
