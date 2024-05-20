import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false })
  gender: string;

  @OneToOne(() => User, { cascade: true }) // Adding cascade option
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Folder, (folder) => folder.parentProfile)
  folders: Folder[];
}
