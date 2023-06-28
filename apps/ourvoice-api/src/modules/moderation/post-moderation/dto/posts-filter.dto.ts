import { IsOptional, IsString } from 'class-validator';
import { ModerationPostStatus } from '../../../../graphql';

export class ModerationPostsFilterDto {
  @IsOptional()
  @IsString()
  status?: ModerationPostStatus;
}
