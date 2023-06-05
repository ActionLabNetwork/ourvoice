import gql from 'graphql-tag'

export const VOTE_MUTATION = gql`
  mutation VotePost($data: VoteCreateInput!) {
    createVote(data: $data) {
      id
      voteType
      user {
        id
      }
      post {
        id
      }
      comment {
        id
      }
    }
  }
`
