import {
  IsInt,
  IsBoolean,
  IsDate,
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
  @IsString()
  authorHash?: string;

  @IsOptional()
  @IsString()
  authorNickname?: string;

  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsInt()
  parentId?: number;

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

  @IsOptional()
  @IsDate()
  disabledAfter?: Date;

  @IsOptional()
  @IsDate()
  disabledBefore?: Date;
}
