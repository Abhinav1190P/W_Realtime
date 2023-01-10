import { gql } from "apollo-server-express";


const typeDefs = gql`

    type User{
        id:ID!
        name:String!
    }

    type Post{
        id:ID!
        heading:String!
        text:String!
        userId:String!
    }

    input UserInput {
        name: String!
    }
    
    input PostInput{
        heading:String!
        text:String!
        userId:String!
    }

    input DeleteInput{
        postId:String!
    }

    type Query{
        getAllPosts:[Post]
    }

    type Mutation{
        createUser(userNew:UserInput!):User
        createPost(postData:PostInput!):Post
        deletePost(deleteData:DeleteInput!):String
    }

    type Subscription{
        postAdded:Post,
        postDeleted:String
    }

`

export default typeDefs