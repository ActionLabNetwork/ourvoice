import {
  CommentUpdateInput,
  CommentsFilterInput,
  CommentPaginationInput,
  CommentCreateInput,
} from './../../graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from '../../modules/comment/comment.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AnalyticsInterceptor } from 'src/analytics/analytics.interceptor';

@Resolver('Comment')
@UseGuards(new AuthGuard())
@UseInterceptors(AnalyticsInterceptor)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  async comment(@Args('id') id: number) {
    return this.commentService.getCommentById(id);
  }

  @Query()
  async comments(
    @Args('filter', { nullable: true }) filter?: CommentsFilterInput,
    @Args('pagination', { nullable: true }) pagination?: CommentPaginationInput,
  ) {
    const { totalCount, edges, pageInfo } =
      await this.commentService.getComments(filter, pagination);
    return { totalCount, edges, pageInfo };
  }

  @Mutation()
  async createComment(@Args('data') data: CommentCreateInput) {
    return this.commentService.createComment(data);
  }

  @Mutation()
  async updateComment(
    @Args('id') id: number,
    @Args('data') data: CommentUpdateInput,
  ) {
    return this.commentService.updateComment(id, data);
  }

  @Mutation()
  async deleteComment(@Args('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
