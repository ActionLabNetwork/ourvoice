import gql from 'graphql-tag'

export const GET_VOTES_QUERY = gql`
  query Votes($filter: VotesFilterInput) {
    votes(filter: $filter) {
      id
      voteType
      comment {
        id
      }
      post {
        id
      }
    }
  }
`
export interface Vote {
  id: number
  voteType: 'UPVOTE' | 'DOWNVOTE'
  comment: {
    id: number
  }
  post: {
    id: number
  }
}
