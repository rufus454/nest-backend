import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  isOptional: boolean;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsString()
  option1?: string;

  @IsOptional()
  @IsString()
  option2?: string;

  @IsOptional()
  @IsString()
  option3?: string;

  @IsOptional()
  @IsString()
  option4?: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;
}
