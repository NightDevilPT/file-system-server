import { File } from 'src/modules/files/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Folder } from 'src/modules/folders/entities/folder.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: string;

  @Column({ nullable: true })
  storageSize: number | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Folder, folder => folder.profile, { cascade: true })
  folders: Folder[];

  @OneToMany(() => File, file => file.profile, { cascade: true })
  files: File[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
