import { File } from 'src/modules/files/entities/file.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: 'FOLDER' })
  type: string;

  @Column({ default: 'PUBLIC' })
  isPrivate: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Profile, profile => profile.folders)
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => Folder, folder => folder.folders, { onDelete: 'CASCADE' })
  parentFolder: Folder;

  @OneToMany(() => Folder, folder => folder.parentFolder, { cascade: true })
  folders: Folder[];

  @OneToMany(() => File, file => file.folder, { cascade: true })
  files: File[];
}
