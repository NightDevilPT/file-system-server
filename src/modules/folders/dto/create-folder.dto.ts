// create-folder.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FolderEnum, PrivateEnum } from '../entities/folder.entity';
import { OneOrTheOther } from 'src/decorator/validate-one-or-other.decorator';

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
