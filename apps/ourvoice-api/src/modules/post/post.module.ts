import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostRepository, PostService],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
