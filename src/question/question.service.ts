import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.questionRepository.save(createQuestionDto);
  }

  async findAll() {
    return await this.questionRepository.find();
  }

  async findByPostId(postId: number) {
    return await this.questionRepository.find({
      where: {
        postId,
      },
    });
  }

  async findOne(id: number) {
    return await this.questionRepository.findBy({
      id,
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return await this.questionRepository.update(id, updateQuestionDto);
  }

  async remove(id: number) {
    return await this.questionRepository.delete(id);
  }
}
