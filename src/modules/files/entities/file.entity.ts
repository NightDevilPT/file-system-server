import { FolderEnum, PrivateEnum } from 'src/interfaces/enum';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  size: number;

  @Column({ nullable: false })
  data: string;

  @Column({ default: FolderEnum.FILE, enum: FolderEnum })
  type: FolderEnum;

  @Column({ default: false, type:Boolean })
  isTrash: boolean;

  @Column({ default: PrivateEnum.PUBLIC, enum: PrivateEnum })
  isAccessable: PrivateEnum;

  @Column({ type: 'uuid', array: true, nullable: true })
  userIds: string[];

  @Column({ nullable: false })
  resourceId: string;
  
  @Column({ nullable: false })
  createdBy: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Profile, profile => profile.files)
  parentProfile: Profile;

  @ManyToOne(() => Folder, folder => folder.files)
  parentFolder: Folder;
}
