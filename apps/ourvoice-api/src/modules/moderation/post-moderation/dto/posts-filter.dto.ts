import { IsOptional, IsString } from 'class-validator';
import { ModerationPostStatus } from 'src/graphql';

export class ModerationPostsFilterDto {
  @IsOptional()
  @IsString()
  status?: ModerationPostStatus;
}
