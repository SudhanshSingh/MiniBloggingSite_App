
import React, { useState } from 'react'
import axios from 'axios'
import { toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Create = () => {

  const[blogData,setBlogData]=useState({})
  const navigate=useNavigate()

  const changeHandler=(e)=>{
    setBlogData({...blogData,[e.target.name]:e.target.value})
    console.log(blogData)
  }

 const createBlogHandler= async(e)=>{
  try{
     e.preventDefault()
     let token = localStorage.getItem("token");
     console.log(token)
    let response= await axios.post('http://localhost:4000/blogs',blogData,
    {
      headers: {
        "x-Api-Key": token,
          Accept: 'application/json',
      },
  }
    )
    if(response.status===201){
      toast.success(response.data.message)
      setTimeout(() => navigate("/", { replace: true }), 1500);
    }
  }catch(err){
    toast.error(err.response.data.message)
  }
 }
  return (
    <>
    <div>Create Blog</div>
    {/* <p>{blogData}</p> */}
    <form onSubmit={createBlogHandler}>
      <div>
      <input type='text' placeholder='title ...' name='title' required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='body ...' name='body'required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='authorId ...' name='authorId' required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='tags ...' name='tags' onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='category ...' name='category' required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='subCategory ...' name='subCategory' onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='publishedAt ...' name='publishedAt' onChange={changeHandler}></input>
      </div>
      <div>
      <input type='submit'/>
      </div>
    </form> 

    </>
  )
}

export default Create