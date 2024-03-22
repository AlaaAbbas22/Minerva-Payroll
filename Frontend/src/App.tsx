import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  } from "react-router-dom";
import { Navigate } from "react-router-dom";

import './App.css'
import YTD from './components/YTD'

import Nav2 from './components/Nav2'
import Nav3 from './components/Nav3'
import Timecard from "./components/Timecard";
import History from "./components/History";
import logo from "../public/El statistician (2).png"
import img from "../public/5837088.png"
import Login from "./components/Login";
import Profile from "./components/Profile";
import Http from "./components/Http";
import Tooltip from '@mui/material/Tooltip';
import { useEffect } from "react";


const baseURL = 'http://127.0.0.1:8000'//"https://minerva-payroll.onrender.com"



async function handleLogOut() {
  localStorage.setItem('logged_intern', "false");
  await Http.post(`${baseURL}/logout`, {});
  window.location.replace("/intern/login");
};

const router = createBrowserRouter([
  


  {
    path: "/",
    element: <><div className="bg-white py-2 px-0 md:px-20 ring"><div  className=" relative bottom-4 md:bottom-0">    <div className="flex items-center  relative md:top-3 top-[110px] w-[20%]">
    <Link to="/"><img src={logo} className="h-8" alt="Logo" /></Link>
    </div><div className="relative bottom-2 md:bottom-4"><Link className="p-2 text-black" to="/intern">Intern Side</Link>{localStorage.getItem("logged_intern")=="true"&&<Link to="#" className="p-1 bg-white text-blue-950 rounded-lg ring-2 shadow-lg ring-black hover:bg-red-700 hover:text-white" onClick={handleLogOut}>Log out</Link>}<Tooltip title="Available soon!" placement="top"><Link className="px-2 text-black" to="#">Manager Side</Link></Tooltip>
    </div></div>{localStorage.getItem('logged_intern')=="true"&&<div className="md:absolute top-7 right-6 text-black sm:mx-auto">Hey, {localStorage.getItem('intern_name')}</div>}</div><Outlet/>
      
    </>,
    children:[
      {
        path:"",
        element: <div className="md:p-20 py-40">          <Link to="#" >
        <Tooltip title="Choose a side above!" placement="top"><img src={img} className='mx-auto w-[30%] object-contain rounded-xl hover:scale-110 ' alt="Logo" /></Tooltip>
      </Link></div>
      },
      {path:"/intern/login",
       element:<><Login baseURL={baseURL}/></>},       
      {
        path:"/intern",
        element: <><Nav2/><Outlet/></>,
        children:[
          {
            path:"/intern",
            element: localStorage.getItem("logged_intern")=="true" &&<><h1 className='py-[10%] px-[15%] md:px-[20%] text-4xl md:text-6xl'>Welcome to your dashboard, {localStorage.getItem('intern_name')}!</h1></>||<Navigate replace to="/intern/login" />
          },
          {
            path: "/intern/ytd",
            element: <YTD baseURL={baseURL}/>
          },
          {
            path: "/intern/timecard",
            element: <Timecard baseURL={baseURL}/>
          },
          {
            path: "/intern/profile",
            element: <Profile/>
          }
        ]
      },      
      {
        path:"/manager",
        element: <><Nav3/><Outlet/></>,
        children:[
          {
            path:"/manager",
            element: <><h1 className='py-[20%] px-[15%] md:px-[20%] text-4xl md:text-6xl'>Choose one statistic from the navigation bar above!</h1></>
          }
        ]
      },
      {
        path: "/history",
        element: <><History baseURL={baseURL}/></>
      }
    ]
  },
  ]
);


function App() {
  useEffect(() => {
    Http.get(`${baseURL}/dummy`)
    console.log("Run")
  }, []);


  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App


