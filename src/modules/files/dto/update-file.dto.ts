// dto/update-folder.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class UpdateFileDto {
  @ApiProperty({ example: 'Updated Folder Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'uuid-of-parent-folder', required: false })
  @IsOptional()
  @IsString()
  parentFolderId?: string;
}
