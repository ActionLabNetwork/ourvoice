import { IsOptional, IsString } from 'class-validator';
import { ModerationPostStatus } from 'src/graphql';

export class ModerationPostsFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  status?: ModerationPostStatus;

  @IsOptional()
  @IsString()
  authorHash?: string;
}
