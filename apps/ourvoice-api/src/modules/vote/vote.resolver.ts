import { VoteCreateInput, VotesFilterInput } from 'src/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VoteService } from 'src/modules/vote/vote.service';

@Resolver('Vote')
export class VoteResolver {
  constructor(private readonly voteService: VoteService) {}

  @Mutation()
  async createVote(@Args('data') data: VoteCreateInput) {
    return this.voteService.createVote(data);
  }

  // @Mutation()
  // async deleteVote(@Args('id') id: number) {
  //   return this.voteService.deleteVote(id);
  // }

  @Query()
  async votes(@Args('filter', { nullable: true }) filter?: VotesFilterInput) {
    return this.voteService.getVote(filter);
  }
}
