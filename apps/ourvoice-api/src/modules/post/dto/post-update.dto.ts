import { PartialType } from '@nestjs/mapped-types';
import { PostCreateDto } from './post-create.dto';

export class PostUpdateDto extends PartialType(PostCreateDto) {}
