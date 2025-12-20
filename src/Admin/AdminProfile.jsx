


import React, { } from 'react';


import { Outlet, } from 'react-router-dom';
import Side_bar from './Side_bar';
import Admin_Headbaar from './Admin_Headbaar';






export default function   AdminProfile() {

  return (

    <div className='flex flex-col md:grid md:grid-cols-8 h-screen'>
      <div className='md:col-span-2 '>

        <Side_bar/>
        
      </div>
      <div className=' flex-1 md:col-span-6'>
        <Admin_Headbaar/>
        
          <Outlet />
       
      </div>
    </div>
  );

  
}
