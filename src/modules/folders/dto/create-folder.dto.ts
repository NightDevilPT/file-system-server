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

  @ApiProperty({ example: 'uuid-of-parent-folder', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  @OneOrTheOther('parentProfileId', {
    message: 'Either parentFolderId or parentProfileId must be provided, but not both.',
  })
  parentFolderId?: string;

  @ApiProperty({ example: 'uuid-of-profile', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  @OneOrTheOther('parentFolderId', {
    message: 'Either parentProfileId or parentFolderId must be provided, but not both.',
  })
  parentProfileId?: string;
}
