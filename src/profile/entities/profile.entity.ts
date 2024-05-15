import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';


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
}
