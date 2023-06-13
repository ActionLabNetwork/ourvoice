import { IsOptional, IsString } from 'class-validator';
import { ModerationCommentStatus } from 'src/graphql';

export class ModerationCommentsFilterDto {
  @IsOptional()
  @IsString()
  status?: ModerationCommentStatus;
}
