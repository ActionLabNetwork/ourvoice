import gql from 'graphql-tag'

export const GET_VOTES_QUERY = gql`
  query Votes($filter: VotesFilterInput) {
    votes(filter: $filter) {
      id
      voteType
      authorHash
      authorNickname
      comment {
        id
        votesUp
        votesDown
      }
      post {
        id
        votesUp
        votesDown
      }
    }
  }
`
export interface Vote {
  id: number
  authorHash: string
  authorNickname: string
  voteType: 'UPVOTE' | 'DOWNVOTE'
  comment: {
    id: number
    votesUp: number
    votesDown: number
  }
  post: {
    id: number
    votesUp: number
    votesDown: number
  }
}
