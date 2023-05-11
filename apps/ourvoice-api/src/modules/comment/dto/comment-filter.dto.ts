import {
  IsInt,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CommentsFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsBoolean()
  moderated?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsInt()
  authorId?: number;

  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @IsOptional()
  @IsDateString()
  moderatedAfter?: string;

  @IsOptional()
  @IsDateString()
  moderatedBefore?: string;

  @IsOptional()
  @IsDateString()
  publishedAfter?: string;

  @IsOptional()
  @IsDateString()
  publishedBefore?: string;

  @IsOptional()
  @IsDateString()
  disabledAfter?: string;

  @IsOptional()
  @IsDateString()
  disabledBefore?: string;
}
