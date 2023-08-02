import { VoteCreateInput, VotesFilterInput } from 'src/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VoteService } from 'src/modules/vote/vote.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AnalyticsInterceptor } from 'src/analytics/analytics.interceptor';

@UseGuards(new AuthGuard())
@Resolver('Vote')
@UseInterceptors(AnalyticsInterceptor)
export class VoteResolver {
  constructor(private readonly voteService: VoteService) {}

  @Mutation()
  async createVote(@Args('data') data: VoteCreateInput) {
    // endpoint for creating and deleting votes
    return this.voteService.createOrDeleteVote(data);
  }

  @Query()
  async votes(@Args('filter', { nullable: true }) filter?: VotesFilterInput) {
    return this.voteService.getVotes(filter);
  }
}
