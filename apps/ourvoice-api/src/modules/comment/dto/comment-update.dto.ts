import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Length,
} from 'class-validator';

export class CommentUpdateDto {
  @IsOptional()
  @Length(1, 255)
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
  authorId?: number;
}
