import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../Context_holder';

export default function Side_bar() {
  const { menu_links } = useContext(Context);
  const [highlight, sethighlight] = useState("");

  return (
    <div className="md:flex h-screen hidden sticky top-0 w-full shadow-md shadow-[#FFD700]">
      <div className="w-full bg-[#0a0a0a]  text-[#d4af37] flex flex-col shadow-2xl">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-3 px-3 text-lg font-bold bg-[#ffd700] text-black shadow-md">
          <Link to={""}>
            Smm
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {menu_links?.map((data, index) => (
              <div
                key={index}
                className={`relative items-center py-2 px-4 mb-1 rounded transition-all duration-300 hover:bg-[#1c1c1c] ${
                  highlight === data.name
                    ? "bg-[#111] text-[#ffd700] border-l-4 border-[#ffd700] shadow-lg"
                    : "text-[#ffd700]"
                } gap-2 group`}
              >

                <div className=' flex gap-2 items-center'>

                    {data?.icon}
                {/* Main Link */}
                <Link
                 to={data?.url!==null&&data?.url}
                  className="  group-hover:translate-x-1 whitespace-nowrap truncate duration-300 font-medium text-md"
                >
                 { data.name}
                </Link>
                </div>
              

                {/* Sub Items */}
                <div className="gap-2 mt-1 text-sm group-hover:flex hidden py-1 px-2 rounded-e-md">
                  {data?.subitems?.map((subitem, subIndex) => (

 

     <Link
                      key={subIndex}
                      to={subitem.url}
                      className="text-black border border-[#ffd700] bg-[#ffd700] px-2 py-1 rounded-md hover:text-[#ffd700] hover:bg-[#111] hover:border-[#ffd700] transition-all duration-300 hover:shadow-md shadow-[#ffd700] flex  items-center gap-1 "
                      onClick={() => sethighlight(data.name)}
                    >
                       {subitem?.icon}
                      {subitem.name}
                    </Link>



                 
                  ))}
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
