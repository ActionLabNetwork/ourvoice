import { IsOptional, IsString } from 'class-validator';
import { ModerationCommentStatus } from '../../../../graphql';

export class ModerationCommentsFilterDto {
  @IsOptional()
  @IsString()
  status?: ModerationCommentStatus;
}
