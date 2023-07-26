import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import {
  Poll,
  PollCreateInput,
  PollFilterInput,
  PollPaginationInput,
  PollUpdateInput,
  PollWithResult,
  PollWithResultConnection,
  PollWithStatsConnection,
  VoteInput,
  VoteResponse,
} from '../../graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlSession } from 'src/auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { validateUserPermission } from 'src/utils/auth';

@Resolver('Poll')
@UseGuards(new AuthGuard())
@Injectable()
export class PollResolver {
  constructor(private readonly pollService: PollService) {}

  @Query()
  async availablePolls(@Args('userHash') userHash: string): Promise<Poll[]> {
    return await this.pollService.getAvailablePolls(userHash);
  }

  @Query()
  async pollsWithResult(
    @GqlSession() session: SessionContainer,
    @Args('moderatorHash') moderatorHash: string,
    @Args('filter') filter?: PollFilterInput,
    @Args('pagination') pagination?: PollPaginationInput,
  ): Promise<PollWithResultConnection> {
    await validateUserPermission(session);
    return await this.pollService.getPollsWithResult(
      moderatorHash,
      filter,
      pagination,
    );
  }

  @Query()
  async votedPolls(
    @Args('userHash') userHash: string,
    @Args('pagination') pagination?: PollPaginationInput,
  ): Promise<PollWithStatsConnection> {
    return await this.pollService.getVotedPolls(userHash, pagination);
  }

  @Mutation()
  async createPoll(
    @GqlSession() session: SessionContainer,
    @Args('data') data: PollCreateInput,
  ): Promise<Poll> {
    await validateUserPermission(session);
    return await this.pollService.createPoll(data);
  }

  @Mutation()
  async updatePoll(
    @GqlSession() session: SessionContainer,
    @Args('pollId') pollId: number,
    @Args('data') data: PollUpdateInput,
  ): Promise<Poll> {
    await validateUserPermission(session);
    return await this.pollService.updatePoll(pollId, data);
  }

  @Mutation()
  async removePoll(
    @GqlSession() session: SessionContainer,
    @Args('pollId') pollId: number,
  ): Promise<number> {
    await validateUserPermission(session);
    return await this.pollService.removePoll(pollId);
  }

  @Mutation()
  async votePoll(@Args('voteInput') vote: VoteInput): Promise<VoteResponse> {
    return await this.pollService.vote(vote);
  }
}
