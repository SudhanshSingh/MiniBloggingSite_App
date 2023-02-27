
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Blog from '../Components/Blog'

const Home = () => {

  const [allBlogs,setAllBlogs]=useState([])

  useEffect(()=>{
    getAllBlogs()
  })

  const getAllBlogs= async ()=>{
    let token = localStorage.getItem("token");
    let response=await axios.get("http://localhost:4000/allblogs",{
      headers: {
          'x-Api-Key': token,
          Accept: 'application/json',
      },
  })
    setAllBlogs(response.data.data)

  }
    
  return (
    <div>
        <h1>Home Page</h1>
      {allBlogs && allBlogs.map((each)=><Blog key={each._id} {...each}/>)}  
    </div>
    
  )
}

export default Home