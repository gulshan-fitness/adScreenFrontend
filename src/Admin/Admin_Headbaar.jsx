import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { TiArrowBack } from "react-icons/ti";
import { Context } from '../Context_holder';
import {
  MdHome,
 
} from "react-icons/md";

export default function Admin_Headbaar() {
  const { setadmin, admin, menu_links, setadminToken } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlight, sethighlight] = useState("");
  const navigator = useNavigate();

  const Adminlogout_handler = () => {
    setadmin(null);
    setadminToken("");
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_token");
    navigator("/");
  };

  const page_jump_handler = (data) => {
    sethighlight(data.name);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-black text-[#FFD700] py-4 px-8 flex justify-between items-center   sticky top-0 left-0 z-10  shadow-md shadow-[#FFD700] "
    
     >
      <div className="text-lg font-bold">Admin</div>

      <div className={`md:flex md:space-x-4 md:w-auto w-full md:h-auto h-full md:py-0 ${isDropdownOpen ? "left-0" : "left-[-100%]"} md:px-0 py-4 px-9 duration-300 bg-black md:bg-transparent fixed md:relative top-0 right-0 overflow-y-auto md:overflow-visible`}>
        
        {/* Mobile User Info */}
        <div className="focus:outline-none md:hidden gap-2 flex mb-4 capitalize items-center">
          <FaUserCircle className="text-3xl text-[#FFD700]" />
          <div className='text-lg font-semibold'>{admin?.name}</div>
        </div>

        {/* Home Link */}
        <div className="relative items-center md:hidden py-2.5 px-4 mb-1 rounded transition 
        
        duration-200 hover:bg-[#1c1c1c]  gap-2 group">

  <div className=' flex gap-2 items-center'>
     <MdHome className='text-2xl' />
 <Link to="/" className=" group-hover:translate-x-2 duration-300 font-semibold text-lg ">
         
          Home 
          </Link>
  </div>

         
        </div>

        {/* Menu Links */}
        
        {menu_links?.map((data, index) => (
          <div
            key={index}
            className={`relative items-center md:hidden py-1 px-4 mb-1 rounded transition duration-200 ${
              highlight === data.name ? "bg-[#FFD700] text-black" : "text-[#FFD700]"
            } hover:bg-[#1c1c1c]  gap-2 group`}
          >
  <div className=' flex gap-2 items-center'>
                    {data?.icon}
            <Link

            to={data?.url!==null&&data?.url}

              className="block group-hover:translate-x-2 duration-300 whitespace-nowrap truncate font-semibold text-lg"

              onClick={() =>{data?.url!==null&& page_jump_handler(data)}}
              
            >
              {data.name}
            </Link>
            </div>
            <div className='gap-2 group-hover:flex hidden mt-1 px-2 rounded-e-md'>
              {data?.subitems?.map((subitem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subitem.url}
                  className='text-black bg-[#FFD700] px-2  rounded-md hover:text-[#FFD700] hover:bg-black border border-[#FFD700] flex  items-center gap-1 transition-all duration-200'
                  onClick={() => page_jump_handler(data)}
                >
                  {subitem?.icon}
                  {subitem.name}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Logout & Back Buttons for Mobile */}
        <div className={`md:hidden ${admin ? "block" : "hidden"} py-4 md:mb-0 mb-4`}>
          <Link
            to=""
            className="text-black text-lg font-semibold bg-[#FFD700] py-2 px-4 rounded-md hover:text-[#FFD700] hover:bg-black border border-[#FFD700] transition-all duration-200"
            onClick={Adminlogout_handler}
          >
            Logout
          </Link>

          <button className="flex items-center gap-2 mt-5" onClick={() => setIsDropdownOpen(false)}>
            <TiArrowBack className="text-lg transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="transition-colors duration-300">Back</span>
          </button>
        </div>

        <i className="fa-solid fa-xmark absolute top-5 right-5 text-2xl md:hidden text-[#FFD700]" onClick={() => setIsDropdownOpen(false)}></i>
      </div>

      {/* Desktop User Info */}
      <div>
        <Link className="md:flex gap-2 hidden relative group capitalize items-center">
          <FaUserCircle className="text-3xl text-[#FFD700]" />
          <div className='text-lg font-semibold'>{admin?.name}</div>
          <div
            className={`absolute group-hover:block py-6 ${
              admin ? "block" : "hidden"
            } duration-200 w-full text-center text-lg font-semibold hidden top-5`}
            onClick={Adminlogout_handler}
          >
            <button className='bg-black hover:bg-[#FFD700] text-[#FFD700] hover:text-black h-7 px-3 rounded-md border border-[#FFD700] transition-all duration-200'>
              Logout
            </button>
          </div>
        </Link>

        <button className="focus:outline-none md:hidden" onClick={() => setIsDropdownOpen(true)}>
          <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M3 10h18M3 15h18M3 20h18"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
