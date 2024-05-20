import { Profile } from 'src/profile/entities/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum ParentType {
  PROFILE = 'Profile',
  FOLDER = 'Folder',
}

export enum FolderType {
  FOLDER = 'Folder',
  FILE = 'File',
}

@Entity()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ParentType })
  parentType: ParentType;

  @Column({ type: 'enum', enum: FolderType })
  type: FolderType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.folders, { nullable: true })
  @JoinColumn({ name: 'parentProfileId', referencedColumnName: 'id' })
  parentProfile: Profile;

  @ManyToOne(() => Folder, (folder) => folder.subFolders, { nullable: true })
  @JoinColumn({ name: 'parentFolderId', referencedColumnName: 'id' })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  subFolders: Folder[];

  @Column({ type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ type: 'uuid', nullable: false })
  updatedBy: string;
}
