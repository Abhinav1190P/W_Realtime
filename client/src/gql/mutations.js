import {gql} from '@apollo/client'


export const CREATE_USER = gql`
mutation CreateUser($userNew: UserInput!) {
    createUser(userNew: $userNew) {
      id
      name
    }
  }
`

export const GET_POSTS = gql`
query GetAllPosts {
  getAllPosts {
    heading
    id
    text
    userId
  }
}
`

export const CREATE_POST = gql`
mutation CreatePost($postData: PostInput!) {
  createPost(postData: $postData) {
    id
    heading
    text
    userId
  }
}
`


export const DELETE_POST = gql`
mutation DeletePost($deleteData: DeleteInput!) {
  deletePost(deleteData: $deleteData)
}
`

export const POST_ADDED = gql`
subscription Subscription{
  postAdded {
    id
    heading
    text
    userId
  }
}
`

export const POST_DELETED = gql`
subscription Subscription{
  postDeleted 
}
`