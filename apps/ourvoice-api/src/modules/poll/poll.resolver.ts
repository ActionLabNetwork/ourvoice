import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import {
  Poll,
  PollCreateInput,
  PollFilterInput,
  PollPaginationInput,
  PollUpdateInput,
  PollWithResultConnection,
  PollWithStats,
  VoteInput,
  VoteResponse,
} from '../../graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlSession } from 'src/auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { validateUserPermission } from 'src/utils/auth';
import { AuthService } from '../../auth/auth.service';

@Resolver('Poll')
@UseGuards(new AuthGuard())
@Injectable()
export class PollResolver {
  constructor(
    private readonly pollService: PollService,
    private readonly authService: AuthService,
  ) {}

  @Query()
  async availablePolls(
    @GqlSession() session: SessionContainer,
    @Args('userHash') userHash: string,
  ): Promise<Poll[]> {
    // this.authService.validateClaimedHash(session, userHash);

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
    this.authService.validateClaimedHash(session, moderatorHash);

    return await this.pollService.getPollsWithResult(
      moderatorHash,
      filter,
      pagination,
    );
  }

  @Query()
  async votedPolls(
    @GqlSession() session: SessionContainer,
    @Args('userHash') userHash: string,
  ): Promise<PollWithStats[]> {
    await this.authService.validateClaimedHash(session, userHash);

    return await this.pollService.getVotedPolls(userHash);
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
  async votePoll(
    @GqlSession() session: SessionContainer,
    @Args('voteInput') vote: VoteInput,
  ): Promise<VoteResponse> {
    await this.authService.validateClaimedHash(session, vote.voterHash);

    return await this.pollService.vote(vote);
  }
}
