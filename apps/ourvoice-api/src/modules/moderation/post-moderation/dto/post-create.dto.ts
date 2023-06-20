import {
  IsString,
  IsOptional,
  Length,
  IsNumber,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class PostCreateDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(1, 255)
  content: string;

  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  categoryIds: number[];

  @IsString({ each: true })
  @IsOptional()
  files?: string[];

  @IsString()
  authorHash: string;

  @IsString()
  authorNickname: string;

  @IsNumber()
  requiredModerations: number;
}
