import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { FolderType, ParentType } from '../entities/folder.entity';

export class UpdateFolderDto {
  @ApiProperty({ enum: ParentType, example: ParentType.PROFILE })
  @IsEnum(ParentType)
  @IsOptional()
  parentType?: ParentType;

  @ApiProperty({ enum: FolderType, example: FolderType.FOLDER })
  @IsEnum(FolderType)
  @IsOptional()
  type?: FolderType;

  @ApiProperty({ example: 'Updated Folder' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'uuid-of-parent-folder' })
  @IsUUID()
  @IsOptional()
  parentFolder?: string;
}
