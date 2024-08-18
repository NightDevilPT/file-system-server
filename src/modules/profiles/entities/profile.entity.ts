import { File } from 'src/modules/files/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { GenderEnum, StorageType } from '../interfaces/profile.interfaces';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, enum: GenderEnum })
  gender: string;

  @Column({ nullable: true })  // Making this column nullable in case avatar is optional
  avatar: string;

  @Column({ nullable: false })
  storageSize: number | null;

  @Column({ nullable: false, enum: StorageType })
  upgraded: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Folder, (folder) => folder.parentProfile, { cascade: true })
  folders: Folder[];

  @OneToMany(() => File, (file) => file.parentProfile, { cascade: true })
  files: File[];

  @OneToOne(() => User, (user) => user.profile, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinColumn()
  user: User;
}
