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
  @IsDate()
  expiresAt?: Date | null;

  @IsString()
  @IsOptional()
  @Length(1, 200)
  question?: string;

  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(PollCreateDto.MAX_NUM_OPTIONS)
  @ValidateNested()
  @Type(() => PollOptionCreateDto)
  // easier to force the user to recreate the poll
  options?: PollOptionCreateDto[];
}
