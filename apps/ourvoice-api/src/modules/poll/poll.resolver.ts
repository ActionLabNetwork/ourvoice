import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { PollService } from './poll.service';
import {
  Poll,
  PollCreateInput,
  PollUpdateInput,
  PollWithResult,
  VoteInput,
  VoteResponse,
} from '../../graphql';

@Resolver('Poll')
@Injectable()
export class PollResolver {
  constructor(private readonly pollService: PollService) {}

  @Query()
  async availablePolls(@Args('userHash') userHash: string): Promise<Poll[]> {
    return await this.pollService.getAvailablePolls(userHash);
  }

  @Query()
  async pollsWithResult(
    @Args('moderatorHash') moderatorHash: string,
  ): Promise<PollWithResult[]> {
    return await this.pollService.getPollsWithResult(moderatorHash);
  }

  @Mutation()
  async createPoll(@Args('data') data: PollCreateInput): Promise<Poll> {
    return await this.pollService.createPoll(data);
  }

  @Mutation()
  async updatePoll(
    @Args('pollId') pollId: number,
    @Args('data') data: PollUpdateInput,
  ): Promise<Poll> {
    return await this.pollService.updatePoll(pollId, data);
  }

  @Mutation()
  async votePoll(@Args('voteInput') vote: VoteInput): Promise<VoteResponse> {
    return await this.pollService.vote(vote);
  }
}
