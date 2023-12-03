import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'questions',
  schema: 'questions',
})
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isOptional: boolean;

  @Column({
    type: 'text',
  })
  question: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  answer?: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  option1?: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  option2?: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  option3?: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  option4?: string;

  @Column()
  @Exclude()
  postId: number;

  @ManyToOne(() => Post, (post) => post.questions, {
    eager: true,
  })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;
}
