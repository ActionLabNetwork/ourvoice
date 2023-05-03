import gql from 'graphql-tag'

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($data: CommentCreateInput!) {
    createComment(data: $data) {
      id
      content
      createdAt
      author {
        id
        nickname
      }
      post {
        id
        title
      }
      parent {
        id
        content
      }
    }
  }
`
