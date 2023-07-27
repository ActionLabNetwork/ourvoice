import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  PollFilterInput,
  PollPaginationInput,
  PollWithResultConnection,
  PollWithStats,
  VoteInput,
  VoteResponse,
} from '../../graphql';
import { numberToCursor } from '../../utils/cursor-pagination';
import { PollCreateDto } from './dto/poll-create.dto';
import { PollUpdateDto } from './dto/poll-update.dto';
import { PollModerationRepository } from './poll-moderation.repository';
import { PollRepository } from './poll.repository';

@Injectable()
export class PollService {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly pollModerationRepository: PollModerationRepository,
  ) {}

  async getAvailablePolls(userHash: string) {
    const { polls: allActivePolls } = await this.pollRepository.getPolls({
      expiresAfter: new Date(),
      active: true,
      published: true,
    });

    const pollsUserVotedFor =
      await this.pollModerationRepository.getPollsVoterVoted(userHash);
    const pollsUserVotedForIds = new Set(
      pollsUserVotedFor.map((pollUserVotedFor) => pollUserVotedFor.pollId),
    );
    return allActivePolls.filter((poll) => !pollsUserVotedForIds.has(poll.id));
  }

  async getVotedPolls(userHash: string): Promise<PollWithStats[]> {
    const activePolls = await this.pollRepository.getPolls({ active: true });
    const pollIdsVoted = (
      await this.pollModerationRepository.getPollsVoterVoted(
        userHash,
        activePolls.polls.map((poll) => poll.id),
      )
    ).map((pollVoted) => pollVoted.pollId);
    const activePollsVoted = activePolls.polls.filter((poll) =>
      pollIdsVoted.includes(poll.id),
    );

    const pollsWithStats = activePollsVoted.map(async (poll) => ({
      ...poll,
      stats: await this.getStatsOfPoll(poll.id),
    }));
    return Promise.all(pollsWithStats);
  }

  async getPollsWithResult(
    moderatorHash: string,
    filter?: PollFilterInput,
    pagination?: PollPaginationInput,
  ): Promise<PollWithResultConnection> {
    const { polls, totalCount } = await this.pollRepository.getPolls(
      filter,
      pagination,
    );
    const pollsWithResult = polls.map(async (poll) => {
      const pollVotes = await this.pollModerationRepository.getPollVotes(
        poll.id,
      );
      const optionIdToNumVotes = new Map();
      for (const vote of pollVotes) {
        optionIdToNumVotes.set(vote.optionId, vote.numVotes);
      }
      return {
        ...poll,
        options: poll.options.map((option) => ({
          ...option,
          numVotes: optionIdToNumVotes.has(option.id)
            ? optionIdToNumVotes.get(option.id)
            : 0,
        })),
      };
    });

    const edges = (await Promise.all(pollsWithResult)).map(
      (pollWithResult) => ({
        node: pollWithResult,
        cursor: numberToCursor(pollWithResult.id),
      }),
    );

    return {
      totalCount,
      edges,
      pageInfo: {
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        hasNextPage: edges.length < totalCount,
      },
    };
  }

  async createPoll(data: PollCreateDto) {
    const pollCreateDto = plainToClass(PollCreateDto, data);
    const errors = await validate(pollCreateDto);
    if (errors.length > 0) {
      console.log(errors);
      throw new BadRequestException(errors);
    }

    return await this.pollRepository.createPoll(pollCreateDto);
  }

  async updatePoll(pollId: number, data: PollUpdateDto) {
    const pollDto = plainToClass(PollUpdateDto, data);
    const errors = await validate(pollDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const poll = await this.pollRepository.getPoll(pollId);
    if (!poll) {
      throw new NotFoundException('Poll does not exist');
    }

    const questionChanged =
      data.question !== undefined || data.options !== undefined;
    if (questionChanged) {
      const pollVotes = await this.pollModerationRepository.getPollVotes(
        pollId,
      );
      if (pollVotes.length != 0) {
        throw new BadRequestException(
          'Unable to change question or options if there are votes',
        );
      }
    }

    const newPoll = await this.pollRepository.updatePoll(pollId, pollDto);

    // this prevents some (but not all race conditions)
    this.pollModerationRepository.removeAllVotesOfPoll(pollId);

    return newPoll;
  }

  async removePoll(pollId: number) {
    const poll = await this.pollRepository.getPoll(pollId);
    if (poll === null) {
      throw new NotFoundException('Non existent poll');
    }
    const pollVotes = await this.pollModerationRepository.getPollVotes(pollId);
    if (pollVotes.length != 0) {
      throw new BadRequestException('Unable to remove poll if there are votes');
    }
    await this.pollRepository.removePollById(pollId);
    return pollId;
  }

  async vote(voteInput: VoteInput): Promise<VoteResponse> {
    const { pollId, voterHash, optionId } = voteInput;
    const poll = await this.pollRepository.getPoll(pollId);
    if (poll === null) {
      throw new NotFoundException('Non existent poll');
    }
    if (!poll.published) {
      throw new BadRequestException('Poll is not active');
    }
    if (poll.expiresAt !== null && new Date() >= poll.expiresAt) {
      throw new BadRequestException('Poll has expired');
    }
    const pollOption = await this.pollRepository.getPollOption(optionId);
    if (pollOption === null) {
      throw new NotFoundException('non existent optionId');
    }
    if (pollId != pollOption.pollId) {
      throw new BadRequestException('pollId does not match with option Id');
    }

    await this.pollModerationRepository.vote(voterHash, pollId, optionId);
    return {
      pollId,
      optionId,
      stats: await this.getStatsOfPoll(pollId),
    };
  }

  async getStatsOfPoll(pollId: number) {
    const pollVotes = await this.pollModerationRepository.getPollVotes(pollId);
    const numTotalVotes = pollVotes.reduce(
      (acc, pollVote) => acc + pollVote.numVotes,
      0,
    );
    let stats: { optionId: number; proportion: number }[] | null = null;
    if (numTotalVotes >= 5) {
      stats = pollVotes.map((pollVote) => ({
        optionId: pollVote.optionId,
        proportion: pollVote.numVotes / numTotalVotes,
      }));
    }
    return stats;
  }
}
