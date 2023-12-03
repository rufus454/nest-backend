import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import slugify from 'slugify';
import { Exclude } from 'class-transformer';
import { Question } from '../../question/entities/question.entity';

@Entity({ name: 'posts', schema: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({ default: null })
  slug: string;

  @Column()
  mainImageUrl: string;

  @Column({ default: null })
  videoUrl: string;

  @Column()
  @Exclude()
  userId: number;

  @Column()
  @Exclude()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.post, {
    eager: true,
  })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @OneToMany(() => Question, (question) => question.post)
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substring(0, 20), {
      lower: true,
      replacement: '_',
    });
  }
}
