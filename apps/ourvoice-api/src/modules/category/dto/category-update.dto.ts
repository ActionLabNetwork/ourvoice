import { PartialType } from '@nestjs/mapped-types';
import { CategoryCreateDto } from './category-create.dto';

export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {}
