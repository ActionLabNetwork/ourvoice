import {
  IsInt,
  IsBoolean,
  IsDate,
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
  @IsDate()
  createdAfter?: Date;

  @IsOptional()
  @IsDate()
  createdBefore?: Date;

  @IsOptional()
  @IsDate()
  moderatedAfter?: Date;

  @IsOptional()
  @IsDate()
  moderatedBefore?: Date;

  @IsOptional()
  @IsDate()
  publishedAfter?: Date;

  @IsOptional()
  @IsDate()
  publishedBefore?: Date;
}
