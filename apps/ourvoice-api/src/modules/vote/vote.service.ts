import { VoteCreateInput, VotesFilterInput } from 'src/graphql';
import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
  constructor(private readonly votetRepository: VoteRepository) {}

  async createVote(data: VoteCreateInput) {
    // send the same data will delete the vote
    const res = await this.votetRepository.getVote(data);
    if (res.length == 1) {
      return this.deleteVote(res[0].id);
    }
    const { userId, postId, commentId, voteType } = data;

    const voteData = {
      voteType,
      user: { connect: { id: userId } },
      post: postId ? { connect: { id: postId } } : undefined,
      comment: commentId ? { connect: { id: commentId } } : undefined,
    };
    return this.votetRepository.createVote(voteData);
  }

  async deleteVote(id: number) {
    return this.votetRepository.deleteVote({ id });
  }

  async getVote(filter?: VotesFilterInput) {
    const { userId, postId, commentId, voteType } = filter;
    const where = {
      voteType: voteType ?? undefined,
      userId: userId ?? undefined,
      postId: postId ?? undefined,
      commentId: commentId ?? undefined,
    };
    return this.votetRepository.getVote(where);
  }
}
