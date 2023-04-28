import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  ArrayMinSize,
  ArrayNotEmpty,
} from 'class-validator';

export class PostUpdateDto {
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
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoryIds?: number[];

  @IsOptional()
  @ArrayMinSize(1)
  @IsString({ each: true })
  files?: string[];
}
