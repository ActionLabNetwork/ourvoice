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
import { PollCreateDto } from './poll-create.dto';

export class PollUpdateDto {
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  postLink?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @ValidateIf((value) => value !== null)
  @IsDateString()
  expiresAt?: string | null | Date;

  @IsString()
  @IsOptional()
  @Length(1, 200)
  question?: string;

  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(PollCreateDto.MAX_NUM_OPTIONS)
  @ValidateNested()
  // easier to force the user to recreate the poll
  options?: PollOptionCreateDto[];
}