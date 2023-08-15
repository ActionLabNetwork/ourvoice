import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsInt,
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

  @IsDate()
  @IsOptional()
  createdAfter: DateTime;

  @IsDate()
  @IsOptional()
  createdBefore: DateTime;

  @IsDate()
  @IsOptional()
  disabledAfter: DateTime;

  @IsDate()
  @IsOptional()
  disabledBefore: DateTime;
}
