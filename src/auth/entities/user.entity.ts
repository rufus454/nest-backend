import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Post } from 'src/post/entities/post.entity';
import { UserRoles } from 'src/common/enum';

@Entity({ name: 'users', schema: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: null })
  image: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Reader })
  roles: UserRoles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
