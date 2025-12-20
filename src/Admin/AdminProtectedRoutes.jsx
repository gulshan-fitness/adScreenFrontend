



import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context_holder";

export default function AdminProtectedRoutes({ children }) {
  const { setadminToken, setadmin, notify } = useContext(Context);

  const navigator = useNavigate();
     const admindata = JSON.parse(localStorage.getItem("admin"));
      const admintoken = localStorage.getItem("admin_token");
      

  useEffect(() => {
     const  verifyAdmin= async () => {
   
if(admindata && admintoken) {
    await  axios.get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ADMIN_URL}AdminVerify/${admindata?._id}`,
      {headers:{Authorization: admintoken}}
   )
        .then((response) => {

          
          if (response.data.status === 1) {

            if(response.data.admin?.role=="superadmin"){
                notify("You Are Super Admin", 1)
            }
          
              
  
            setadmin(response.data.admin)
            setadminToken(response.data.token)
            localStorage.setItem("admin", JSON.stringify(response.data.admin))
            localStorage.setItem("admin_token", response.data.token)
          }
          else{  notify("You Are Not Super Admin", 0)
            navigator('/adminloginitslocked')
            setadmin(null)
            setadminToken(null)
            localStorage.removeItem("admin")
            localStorage.removeItem("admin_token")
          }
        })
        .catch((error) => {
          console.error(error)
        })
}

    }

    verifyAdmin();


  }, []);

  useEffect(
    ()=>{
 if (!admindata || !admindata || admindata?.role !== "superadmin") {
        navigator("/adminloginitslocked");
      
      }
    },[admindata,admindata]
  )


 

    
  return children;
      


}
