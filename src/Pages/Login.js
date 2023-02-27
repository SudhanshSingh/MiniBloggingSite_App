
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast} from 'react-toastify';
import { NavLink, useNavigate } from "react-router-dom";


const Login = () => {

 const navigate=useNavigate()
 
 // if user is already logined
 useEffect(()=>{
   let token=localStorage.getItem('token')
   if(token) navigate('/')
  })
  
  const[logInData,setLogInData]=useState({})
  
  const loginChangeHandler=(e)=>{
  setLogInData({...logInData,[e.target.name]:e.target.value})
  console.log(logInData)
  }

  const logInHandler= async(e)=>{
    try{
      e.preventDefault()
     let response= await axios.post('http://localhost:4000/login',logInData)
     if(response.status===200){
       toast.success(response.data.message)
       //console.log('token',response.data.data.token)
      let token=response.data.data.token
       console.log('token',token)
       localStorage.setItem('token',token)
       setTimeout(() => navigate("/", { replace: true }), 1500);
     }
   }catch(err){
     toast.error(err.response.data.message)
   }
  }

  return (
    <>
    <h2>Welcome back. </h2>
    <form onSubmit={logInHandler}>
    <div>
      <input type='text' placeholder='Enter Email ...' name='email' required onChange={loginChangeHandler}></input>
      </div>
      <div>
      <input type='password' placeholder='Enter Password ...' name='password' required onChange={loginChangeHandler}></input>
      </div>
      <div>
        <input type="submit"></input>
      </div>
    </form>
    <div>
      <br/>
      <span>No account?</span>
      <NavLink to={'/register'}>Create One</NavLink>
    </div>
    </>
  )
}

export default Login