import gql from 'graphql-tag'

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($data: PostCreateInput!) {
    createPost(data: $data) {
      id
      title
      content
      createdAt
      updatedAt
      author {
        id
        nickname
      }
      categories {
        id
        name
      }
      comments {
        id
        content
      }
      votesUp
      votesDown
    }
  }
`
