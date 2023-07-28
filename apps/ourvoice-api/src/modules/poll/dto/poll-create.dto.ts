import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PollOptionCreateDto } from './option-create.dto';

export class PollCreateDto {
  static readonly MAX_NUM_OPTIONS = 6;

  @IsString()
  @Length(1, 200)
  question: string;

  @IsBoolean()
  published: boolean;

  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  postLink?: string;

  @IsNumber()
  weight: number;

  @IsOptional()
  @ValidateIf((value) => value !== null)
  @IsDateString()
  expiresAt?: string | null | Date;

  @ValidateNested()
  @ArrayMinSize(2)
  @ArrayMaxSize(PollCreateDto.MAX_NUM_OPTIONS)
  options: PollOptionCreateDto[];
}