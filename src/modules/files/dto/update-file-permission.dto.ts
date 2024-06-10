import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PrivateEnum } from 'src/interfaces/enum';

export class UpdateFilePermissionDto {
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
