import React, {  useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../Context_holder'
import axios from 'axios'

export default function UserProtectedRouts({children}) {
const{setusertoken,setuser}=useContext(Context)
     const user= JSON.parse(localStorage.getItem("user"))
    const usertoken=localStorage.getItem("usertoken")
    const navigater=useNavigate()

    useEffect(
        ()=>{
  const  verifyuser= async () => {
   
if(user && usertoken) {
    await  axios.get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}userverify/${user?._id}`,
      {headers:{Authorization: usertoken}}
   )
        .then((response) => {

          
          if (response.data.status === 1) {

         setuser(response.data.user);
          setusertoken(response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("usertoken", response.data.token);

          }
          else{  


                setuser(null);
          setusertoken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("usertoken");
            navigater('/userlogin')
        
          }
        })
        .catch((error) => {
          console.error(error)
        })
}

    }

    verifyuser();

        },[]
    )


    useEffect(
      ()=>{
if(!user || !usertoken)  navigater('/userlogin')
      },[user,usertoken]
    )


  return children

}


