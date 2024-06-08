import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, IsUUID } from 'class-validator';
import { FolderEnum, PrivateEnum } from '../entities/folder.entity';
import { Transform, Type } from 'class-transformer';

export class UpdateFolderPermissionDto {
  @ApiProperty({
    enum: PrivateEnum,
    example: PrivateEnum.PUBLIC,
    description: 'Permission level for the folder',
  })
  isPrivate: PrivateEnum;

  @ApiProperty({
    description: 'Array of UUID strings',
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item: string) => item.trim());
    }
    return value;
  })
  userIds: string;
}
