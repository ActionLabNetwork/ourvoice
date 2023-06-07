import { IsString, Length, IsNumber } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  @Length(1, 255)
  content: string;

  @IsString()
  authorHash: string;

  @IsString()
  authorNickname: string;

  @IsNumber()
  requiredModerations: number;
}
