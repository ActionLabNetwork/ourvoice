import gql from 'graphql-tag'

export const VOTE_MUTATION = gql`
  mutation CreateOrDeleteVote($data: VoteCreateInput!) {
    createVote(data: $data) {
      id
      voteType
      authorHash
      authorNickname
      post {
        id
        votesUp
        votesDown
      }
      comment {
        id
        votesUp
        votesDown
      }
    }
  }
`
