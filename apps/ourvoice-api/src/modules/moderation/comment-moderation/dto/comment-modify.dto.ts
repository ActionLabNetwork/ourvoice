import { IsString, Length } from 'class-validator';

export class CommentModifyDto {
  @IsString()
  @Length(1, 255)
  content?: string;
}
