import pc from '@prisma/client'
import {PubSub} from 'graphql-subscriptions'


const pubsub = new PubSub()

const prisma = new pc.PrismaClient()


const POST_ADDED = "POST_ADDED"
const POST_DELETED = "POST_DELETED"

const resolvers = {
    Query:{
        getAllPosts: async(_,{args})=>{
            const posts = await prisma.post.findMany({})
            return posts
        }
    },
    Mutation:{
        createUser: async(_,{userNew}) => {

            const isUserAlreadyPresent = await prisma.user.findMany({
                where:{
                    name:userNew.name
                }
            })
            
            if(isUserAlreadyPresent.length > 0){
                return isUserAlreadyPresent[0]
            }
          
                const user = await prisma.user.create({
                    data:{
                        name:userNew.name
                    }
                })
                return user
            
        },
        createPost: async(_,{postData}) => {
            const post = await prisma.post.create({
                data:{
                    heading:postData.heading,
                    text:postData.text,
                    userId:postData.userId
                }
            })
            pubsub.publish(POST_ADDED,{postAdded:post})
            return post
        },
        deletePost: async (_,{deleteData}) => {
            await prisma.post.deleteMany({
                where:
                {id:deleteData.postId}
            })
            pubsub.publish(POST_DELETED,{postDeleted:`${deleteData.postId}`})
            return `Post with id: ${deleteData.postId} deleted`
        }
    },
    Subscription:{
        postAdded:{
            subscribe:()=>pubsub.asyncIterator(POST_ADDED)
        },
        postDeleted:{
            subscribe:()=>pubsub.asyncIterator(POST_DELETED)
        }
    }
    
}
export default resolvers