import { CommentCreateInput, CommentUpdateInput } from './../../graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from 'src/modules/comment/comment.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  async comment(@Args('id') id: number) {
    return this.commentService.getCommentById(id);
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
