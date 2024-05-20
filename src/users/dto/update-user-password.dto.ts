import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordUserDto {
  @ApiProperty({ description: 'The Password of the user', default: 'test123' })
  password: string;
}
