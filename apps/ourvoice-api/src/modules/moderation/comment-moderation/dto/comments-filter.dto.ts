import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ModerationCommentStatus } from '../../../../graphql';

export class ModerationCommentsFilterDto {
  @IsOptional()
  @IsString()
  status?: ModerationCommentStatus;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
