import {
  IsString,
  IsOptional,
  Length,
  IsNumber,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';

export class PostCreateDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  content: string;

  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  categoryIds: number[];

  @IsString({ each: true })
  @IsOptional()
  files?: string[];

  @IsString()
  authorHash: string;

  @IsString()
  authorNickname: string;

  @IsBoolean()
  hasFromTheModeratorsTag: boolean;
}
