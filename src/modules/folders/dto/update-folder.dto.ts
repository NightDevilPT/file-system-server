// dto/update-folder.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { OneOrTheOther } from 'src/decorator/validate-one-or-other.decorator';

export class UpdateFolderDto {
  @ApiProperty({ example: 'Updated Folder Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

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
