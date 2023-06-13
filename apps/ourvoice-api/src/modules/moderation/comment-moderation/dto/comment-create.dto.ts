import { IsString, Length, IsNumber, IsOptional } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  @Length(1, 255)
  content: string;

  @IsNumber()
  @IsOptional()
  postId?: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  authorHash: string;

  @IsString()
  authorNickname: string;

  @IsNumber()
  requiredModerations: number;
}
