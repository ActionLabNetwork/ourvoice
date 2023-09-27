import { IsString, Length } from 'class-validator';

export class CommentModifyDto {
  @IsString()
  content?: string;
}
