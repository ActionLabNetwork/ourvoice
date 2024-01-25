import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PollOptionCreateDto } from './option-create.dto';

export class PollCreateDto {
  static readonly MAX_NUM_OPTIONS = 6;

  @IsString()
  @Length(1, 400)
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
  @IsDate()
  expiresAt?: Date | null;

  @ValidateNested()
  @ArrayMinSize(2)
  @ArrayMaxSize(PollCreateDto.MAX_NUM_OPTIONS)
  @Type(() => PollOptionCreateDto)
  options: PollOptionCreateDto[];
}
