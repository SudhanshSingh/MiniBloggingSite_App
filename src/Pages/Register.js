
import React from 'react'

import { useState } from "react"
import axios from 'axios'
import { toast} from 'react-toastify';
import { NavLink, useNavigate } from "react-router-dom";

function Register(){
    const[data,setData]=useState({})

    const navigate=useNavigate()

    const onChangeHandler=(event)=>{
        setData({...data,[event.target.name]:event.target.value})
        console.log(data)
    }

    const onSubmitHandler =  async(event)=>{
        try{
            event.preventDefault()
            console.log("data",data)
            let response= await axios.post("http://localhost:4000/createAuthor",data)
            console.log("response",response.data)
            if(response.status===201){
                toast.success(response.data.message)
                setTimeout(() => navigate("/", { replace: true }), 1500);
            }
        }catch(err){
            toast.error(err.response.data.message)
        }
    }

    return(
        <div className="register">
            <h1>Join BloggingSite</h1>
            <form onSubmit={onSubmitHandler}>
                <div>
                    <input type="text" placeholder=" fName .." name="fname" required onChange={onChangeHandler}/>
                </div>
                <div>
                    <input type="text" placeholder=" lName .." name="lname" required onChange={onChangeHandler}/>
                </div>
                <div>
                    <input type="text" placeholder="Enter title .." name="title" required onChange={onChangeHandler}/>
                </div>
                <div>
                    <input type="email" placeholder=" Email Id .." name="email" required onChange={onChangeHandler}/>
                </div>
                <div>
                    <input type="password" placeholder="Enter password .." name="password" required onChange={onChangeHandler}/>
                </div>
                <div>
                    <input type="submit"/>
                    
                </div>
            </form>
            <div>
                <br></br>
                <span>Already have an account?</span>
                <NavLink to={'/login'}>Sign in</NavLink>
            </div>
        </div>
    )
}
export default Register