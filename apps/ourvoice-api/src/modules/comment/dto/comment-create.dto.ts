import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  Length,
} from 'class-validator';

export class CommentCreateDto {
  @IsString()
  @Length(1, 255)
  content: string;

  @IsBoolean()
  @IsOptional()
  moderated?: boolean;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsInt()
  authorId: number;

  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsInt()
  @IsOptional()
  postId?: number;
}
