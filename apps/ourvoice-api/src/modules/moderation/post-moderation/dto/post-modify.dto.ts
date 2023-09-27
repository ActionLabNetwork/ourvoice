import {
  IsString,
  IsOptional,
  Length,
  IsNumber,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class PostModifyDto {
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsString()
  content?: string;

  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  categoryIds?: number[];

  @IsString({ each: true })
  @IsOptional()
  files?: string[];
}
