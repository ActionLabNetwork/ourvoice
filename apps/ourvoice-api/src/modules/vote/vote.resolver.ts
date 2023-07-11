import { VoteCreateInput, VotesFilterInput } from 'src/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VoteService } from 'src/modules/vote/vote.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(new AuthGuard())
@Resolver('Vote')
export class VoteResolver {
  constructor(private readonly voteService: VoteService) {}

  @Mutation()
  async createVote(@Args('data') data: VoteCreateInput) {
    return this.voteService.createVote(data);
  }

  @Query()
  async votes(@Args('filter', { nullable: true }) filter?: VotesFilterInput) {
    return this.voteService.getVote(filter);
  }
}
