import { Folder } from 'src/modules/folders/entities/folder.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  data: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Profile, profile => profile.files)
  profile: Profile;

  @ManyToOne(() => Folder, folder => folder.files)
  folder: Folder;
}
