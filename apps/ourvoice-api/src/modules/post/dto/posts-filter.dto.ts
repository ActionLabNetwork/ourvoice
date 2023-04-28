import {
  IsInt,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';

export class PostsFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  moderated?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsInt()
  votesDown?: number;

  @IsOptional()
  @IsInt()
  votesUp?: number;

  @IsOptional()
  @IsInt()
  authorId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

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
}
