import { ApiProperty } from '@nestjs/swagger';
import { FolderType, ParentType } from '../entities/folder.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ enum: ParentType, example: ParentType.PROFILE })
  @IsEnum(ParentType)
  @IsNotEmpty()
  parentType: ParentType;

  @ApiProperty({ enum: FolderType, example: FolderType.FOLDER })
  @IsEnum(FolderType)
  @IsNotEmpty()
  type: FolderType;

  @ApiProperty({ example: 'My Folder' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'uuid-of-parent-folder' })
  @IsString()
  @IsOptional()
  parentFolder?: string;
}
