import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  mainImageUrl: string;

  @IsOptional()
  @IsString()
  videoUrl: string;

  // @IsNotEmpty()
  // userId: number;

  @IsNotEmpty()
  categoryId: number;
}
