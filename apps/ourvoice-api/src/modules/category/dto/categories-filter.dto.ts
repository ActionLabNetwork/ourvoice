import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsArray,
} from 'class-validator';
import { DateTime } from 'src/graphql';

export class CategoriesFilterDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ids: number[];

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsOptional()
  weight: number;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsInt()
  @IsOptional()
  parentId: number;

  @IsDateString()
  @IsOptional()
  createdAfter: DateTime;

  @IsDateString()
  @IsOptional()
  createdBefore: DateTime;

  @IsDateString()
  @IsOptional()
  disabledAfter: DateTime;

  @IsDateString()
  @IsOptional()
  disabledBefore: DateTime;
}
