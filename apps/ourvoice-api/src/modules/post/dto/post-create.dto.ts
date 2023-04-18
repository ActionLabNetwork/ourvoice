import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;
}
