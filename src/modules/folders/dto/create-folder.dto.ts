// create-folder.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { FolderEnum } from 'src/interfaces/enum';

export class CreateFolderDto {
  @ApiProperty({ example: 'New Folder' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FolderEnum, default: FolderEnum.FOLDER })
  @IsEnum(FolderEnum)
  type: FolderEnum;

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  @IsString()
  parentFolderId?: string;
}
