import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { IsEmail } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export enum Provider {
  Github = 'github',
  Local = 'local',
}

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @Column()
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @Column()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @Column()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  @ApiProperty({ description: 'The provider of the user', enum: Provider })
  provider: Provider;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the user is verified or not' })
  isVerified: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The token associated with the user' })
  token: string;
}
