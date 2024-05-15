import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProfileDto {
	@ApiProperty({ description: 'The first name of the user', default: 'John' })
	@IsNotEmpty()
	firstname: string;
  
	@ApiProperty({ description: 'The last name of the user', default: 'Doe' })
	@IsNotEmpty()
	lastname: string;
  
	@ApiProperty({ description: 'The gender of the user', default: 'male' })
	@IsNotEmpty()
	gender: string;
  
	@ApiProperty({ description: 'The avatar URL of the user', default: null })
	@IsOptional()
	avatar: string;
  }