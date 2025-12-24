import React, { useContext } from "react";
import { Context } from "./Context_holder";

import { Outlet } from "react-router-dom";
import TopBar from "./TopBar/TopBar";
import Footer from "./TopBar/Footer";



export default function Home() {

  const {  } = useContext(Context);

  return (
    <>

    <TopBar/>

<Outlet/>


<Footer/>




    </>




    // <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    //   <div className="flex flex-wrap items-center gap-4 ">
    //     {/* Sign Up Button */}
    //     <button
    //       className="w-full sm:w-[150px] text-[#17412D] border-2 border-[#17412D] px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition duration-300 hover:bg-[#17412D] hover:text-[#F6FFFA]"
    //       onClick={() => setUserSignUpPopUp(true)}
         
    //     >
    //       Sign Up
    //     </button>

    //     {/* Login Button */}
    //     <button
    //       className="w-full sm:w-[150px] text-[#17412D] border-2 border-[#17412D] px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition duration-300 hover:bg-[#17412D] hover:text-[#F6FFFA]"
    //       onClick={() => setUserLoginPopUp(true)}
    //     >
    //       Login
    //     </button>
    //   </div>

    //   <UserSignUp/>
    //   <UserLogin/>
    // </div>



  );
}
