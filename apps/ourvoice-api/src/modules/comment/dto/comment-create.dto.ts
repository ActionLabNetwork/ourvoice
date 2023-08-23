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

  @IsString()
  authorHash: string;

  @IsString()
  authorNickname: string;

  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsInt()
  @IsOptional()
  postId?: number;

  @IsBoolean()
  hasContentWarning: boolean;
}
