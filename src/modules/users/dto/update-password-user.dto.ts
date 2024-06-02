import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordUserDto {
  @ApiProperty({ example: 'test123', description: 'Updated Password' })
  @IsNotEmpty()
  password: string;
}
