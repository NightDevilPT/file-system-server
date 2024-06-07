import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail } from 'class-validator';
import { FolderEnum, PrivateEnum } from '../entities/folder.entity';

export class UpdateFolderPermissionDto {
  @ApiProperty({enum:PrivateEnum, example:[] , description: 'Permission level for the folder' })
  isPrivate: PrivateEnum;

  @ApiProperty({
    example: [],
    type: [String],
    description: 'Array of user emails',
  })
  @IsArray()
  @IsEmail({}, { each: true })
  userIds: string[];
}
