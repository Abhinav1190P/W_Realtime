import React, { useState } from 'react'
import './index.css'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { CREATE_USER, GET_POSTS, CREATE_POST, DELETE_POST, POST_ADDED, POST_DELETED } from './gql/mutations';


function Home() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

 const [User,setUser] = useState('')
 const [CreateBool,setCreateBool] = useState(false)
 const [userId, setUserId] = useState('')

 const [Post,SetPost] = useState({
  heading:'',
  text:'',
  userId:''
 })

  const [createAUser,{data:userData,loading:l1,error:er1}] = useMutation(CREATE_USER,{
    onCompleted(data){
      
      SetPost(prevPost => ({
        ...prevPost,userId:data.createUser?.id
      }))
    }
  })

  const {data:subData} = useSubscription(POST_ADDED,{
    onSubscriptionData({subscriptionData:{data}}){
      setItems(prevItems => [...prevItems,data.postAdded])
    }
  })
  
  const {data:delSubData} = useSubscription(POST_DELETED,{
    onSubscriptionData({subscriptionData:{data}}){
      console.log(data)
       let index = items.findIndex(item=>item.id === data.postDeleted)
     
      if(index > -1){
        let clone = items.splice(index,1)
        console.log(clone)
      } 
    }
  })


  const [createPostMutation,{data:postData,loading:l2,error:er2}] = useMutation(CREATE_POST,{
    onCompleted(data){
      SetPost({text:'',heading:'',userId:''})
      setUser('')
    }
  })
  
  const [deltePostMutation,{data:delteData,loading:l3,error:er3}] = useMutation(DELETE_POST,{
    onCompleted(data){
      alert(data.deletePost)
    }
  })

  const { loading, error, data } = useQuery(GET_POSTS,{
    onCompleted(data){
      setItems(data.getAllPosts)
    }
  });




  if(l1 || loading || l2){
    return <div>Please wait</div>
  }

  if(er1 || error || er2){
    return <div>{er1.message}</div>
  }


 

  const deleteItem = (id) => {

    let clone = items.filter((item) => item.id !== id)
    
    setItems(clone)
    deltePostMutation({variables:{deleteData:{postId:id}}})

  } 

  

  const handleCreateUser = (e) => {
    e.preventDefault()
  

    if(User!==""){
      let obj = {
        name:User
      }
      createAUser({variables:{userNew:obj}}) 
  
    }
    else{
      alert('Please enter your name')
    }
   

  }
  const createPost = (e) =>{
    e.preventDefault()
    console.log(Post)
    createPostMutation({variables:{postData:Post}})
  }

  return (

    <div className="flex-container">
      <form onSubmit={handleCreateUser}>
        <label htmlFor="name">Name:</label><br />
        <input onChange={(e)=>setUser(e.target.value)} value={User} type="text" id="name" name="name" /><br />
        <input type="submit" value="Submit" />
      </form>

      <div className='list-div'>
        <ul id="the-ul">
          <button onClick={()=>setCreateBool(!CreateBool)}>Add item</button>

          {
            CreateBool && <form onSubmit={createPost} class="my-form">
            <label for="heading" class="my-form-label">Heading:</label>
            <input type="text" id="heading" name="heading" required
            onChange={(e)=>{SetPost(prevPost => ({
              ...prevPost,heading:e.target.value
            }))}}
            value={Post.heading}
            class="my-form-input"/>
            
            <label for="description" class="my-form-label">Description:</label>
            <textarea id="description" name="description" rows="5"
            onChange={(e)=>{SetPost(prevPost => ({
              ...prevPost,text:e.target.value
            }))}}
            value={Post.text}
            required class="my-form-textarea"></textarea>
            
            <input type="submit" value="Submit" class="my-form-submit"/>
          </form>
          }

          <TransitionGroup className='StyledGrid'>
            {items.map((item, index) => (
              <CSSTransition key={item.id} timeout={300} classNames="transition">
                <li key={index} className='no-item'>

                <h3>{item.heading}</h3>
                <p>{item.text}</p>
                  <button onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ul>
      </div>
    </div>


  )
}

export default Home
