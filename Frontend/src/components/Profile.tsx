
//import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import { Navigate } from 'react-router-dom';

const Profile = () => {


console.log(localStorage)

if (localStorage.getItem("logged_intern")=="false"){
  return <Navigate replace to="/login"/>;
}
else{

return (
  <>
    <Tooltip placement="top" title="Student Information"><div className=" mb-10 mt-6 profile" >
      <h1 className=' pb-2 font-serif'>{localStorage.getItem('intern_name')}</h1>
          <p className='font-sans'><strong>ID: <span className='text-blue-500'>{localStorage.getItem('intern_id')}</span></strong> </p>
          <p className='font-sans'><strong>Email: <span className='text-blue-500'>{localStorage.getItem('email_intern')}</span></strong> </p>
          <p className='font-sans'><strong>Manager: <span className='text-blue-500'>{localStorage.getItem('intern_manager')}</span></strong> </p>
          <p className='font-sans'><strong>Manager Email: <span className='text-blue-500'>{localStorage.getItem('intern_manager_email')}</span></strong> </p>
          <p className='font-sans'><strong>Department: <span className='text-blue-500'>{localStorage.getItem('intern_department')}</span></strong> </p>
    </div></Tooltip>
  </>
)}
}

export default Profile