import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.userId = user ? user.id : 1;

    Object.assign(post, createPostDto);

    this.postRepository.create(post);
    return await this.postRepository.save(post);
  }

  async findAll(query: ExpressQuery) {
    const keyword = query.keyword || '';
    const sort = query.sort || '';
    const category = query.category || '';

    const myQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category');

    if (keyword) {
      myQuery.where('post.title like :keyword', { keyword: `%${keyword}%` });
    }

    if (sort) {
      const order = sort.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      myQuery.orderBy(`post.title`, order);
    }

    if (category) {
      myQuery.andWhere('category.title = :category', { category });
    }

    return myQuery.getMany();
  }

  async findBySlug(slug: string) {
    const post = await this.postRepository.findOneBy({ slug });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await this.postRepository.delete(id);
  }
}
