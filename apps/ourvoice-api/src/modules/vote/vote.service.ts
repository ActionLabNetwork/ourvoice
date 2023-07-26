import { VoteCreateInput, VotesFilterInput } from 'src/graphql';
import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
  constructor(private readonly votetRepository: VoteRepository) {}

  async createOrDeleteVote(data: VoteCreateInput) {
    const { authorHash, authorNickname, postId, commentId, voteType } = data;

    // check if the user has already voted for the post or comment
    const votes = await this.votetRepository.getVotes({
      authorHash,
      authorNickname,
      postId,
      commentId,
    });

    if (votes.length === 1) {
      // if the user has one vote for the post/comment
      if (votes[0].voteType === voteType) {
        // should delete it if the voteType is the same
        // console.log('delete vote');
        return await this.votetRepository.deleteVote({ id: votes[0].id });
      } else {
        // should update it if the voteType is different
        // console.log('update vote');
        return await this.votetRepository.updateVoteById(votes[0].id, {
          voteType,
          post: postId ? { connect: { id: postId } } : undefined,
          comment: commentId ? { connect: { id: commentId } } : undefined,
        });
      }
    } else if (votes.length === 0) {
      // if there are no such votes, create a new one
      // console.log('create vote');
      return await this.votetRepository.createVote({
        voteType,
        authorHash,
        authorNickname,
        post: postId ? { connect: { id: postId } } : undefined,
        comment: commentId ? { connect: { id: commentId } } : undefined,
      });
    } else {
      // if there are more than one such vote, which means there is an error
      // console.log('error: more than one vote for the same user');
      for (const vote of votes) {
        await this.votetRepository.deleteVote({ id: vote.id });
      }
      return await this.votetRepository.createVote({
        voteType,
        authorHash,
        authorNickname,
        post: postId ? { connect: { id: postId } } : undefined,
        comment: commentId ? { connect: { id: commentId } } : undefined,
      });
    }
  }

  async getVotes(filter?: VotesFilterInput) {
    const where = {
      voteType: filter?.voteType ?? undefined,
      authorHash: filter?.authorHash ?? undefined,
      authorNickname: filter?.authorNickname ?? undefined,
      postId: filter?.postId ?? undefined,
      commentId: filter?.commentId ?? undefined,
    };
    return this.votetRepository.getVotes(where);
  }
}
