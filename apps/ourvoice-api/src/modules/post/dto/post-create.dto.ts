import {
  IsString,
  IsBoolean,
  IsInt,
  ArrayMinSize,
  ArrayNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class PostCreateDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  content: string;

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  categoryIds: number[];

  @IsString({ each: true })
  @IsOptional()
  files?: string[];

  @IsString()
  authorHash: string;

  @IsString()
  authorNickname: string;

  @IsBoolean()
  @IsOptional()
  moderated?: boolean;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsInt()
  @IsOptional()
  votesDown?: number;

  @IsInt()
  @IsOptional()
  votesUp?: number;

  @IsBoolean()
  hasContentWarning: boolean;

  @IsBoolean()
  hasFromTheModeratorsTag: boolean;
}
