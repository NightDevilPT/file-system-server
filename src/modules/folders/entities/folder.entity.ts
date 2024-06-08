import { File } from 'src/modules/files/entities/file.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';

export enum FolderEnum {
  FOLDER = 'FOLDER',
  FILE = 'FILE',
}

export enum PrivateEnum {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  ONLY = 'ONLY',
}

@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: FolderEnum.FOLDER, enum: FolderEnum })
  type: FolderEnum;

  @Column({ default: PrivateEnum.PUBLIC, enum: PrivateEnum })
  isPrivate: PrivateEnum;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', array: true, nullable: true })
  userIds: string[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.folders)
  @JoinColumn()
  parentProfile: Profile;

  @ManyToOne(() => Folder, (folder) => folder.childFolders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentFolderId' })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  childFolders: Folder[];

  @OneToMany(() => File, (file) => file.folder, { cascade: true })
  files: File[];


  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
