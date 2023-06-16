import { VoteCreateInput, VotesFilterInput } from 'src/graphql';
import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
  constructor(private readonly votetRepository: VoteRepository) {}

  async createVote(data: VoteCreateInput) {
    // send the same data will delete the vote
    const { authorHash, authorNickname, postId, commentId, voteType } = data;

    const votes = await this.votetRepository.getVote({
      authorHash,
      authorNickname,
      postId,
      commentId,
    });
    if (votes.length == 1) {
      if (votes[0].voteType == voteType) {
        return this.votetRepository.deleteVote({ id: votes[0].id });
      }
      this.votetRepository.deleteVote({ id: votes[0].id });
    }
    if (votes.length > 1) {
      votes.forEach((vote) => {
        this.votetRepository.deleteVote({ id: vote.id });
      });
    }

    const voteData = {
      voteType,
      authorHash,
      authorNickname,
      post: postId ? { connect: { id: postId } } : undefined,
      comment: commentId ? { connect: { id: commentId } } : undefined,
    };
    return this.votetRepository.createVote(voteData);
  }

  async deleteVote(id: number) {
    return this.votetRepository.deleteVote({ id });
  }

  async getVote(filter?: VotesFilterInput) {
    const { authorNickname, authorHash, postId, commentId, voteType } = filter;
    const where = {
      voteType: voteType ?? undefined,
      authorHash: authorHash ?? undefined,
      authorNickname: authorNickname ?? undefined,
      postId: postId ?? undefined,
      commentId: commentId ?? undefined,
    };
    return this.votetRepository.getVote(where);
  }
}
