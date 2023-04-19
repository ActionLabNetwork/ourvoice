import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNumber()
  parentId?: number;
}
