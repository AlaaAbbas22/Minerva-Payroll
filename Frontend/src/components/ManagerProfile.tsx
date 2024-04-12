
//import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import { Navigate } from 'react-router-dom';

const ManagerProfile = () => {




if (localStorage.getItem("logged_intern")=="false"){
  return <Navigate replace to="/login"/>;
}
else{

return (
  <>
    <Tooltip placement="top" title="Manager Information"><div className=" mb-10 mt-6 profile" >
      <h1 className=' pb-2 font-serif'>{localStorage.getItem('intern_manager')}</h1>
          <p className='font-sans'><strong>Email: <span className='text-blue-500'>{localStorage.getItem('intern_manager_email')}</span></strong> </p>
    </div></Tooltip>
  </>
)}
}

export default ManagerProfile