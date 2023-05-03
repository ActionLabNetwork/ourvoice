import { IsString, IsInt, IsOptional, Length } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  description: string;

  @IsInt()
  @IsOptional()
  parentId?: boolean;
}
