import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const Nav3 = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [mob, setmob] = useState(false)
function handleWindowSizeChange() {
    setWidth(window.innerWidth);
}
useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, []);

useEffect(()=>{
  setmob(!(width <= 768))
}, [width])
  return (
    <>
    <nav className="bg-white border-gray-200 ring-2 ring-slate-900">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
    <Link to="/" className="flex items-center">
      
    </Link>
    <div className="flex md:order-2">
        <button data-collapse-toggle="navbar-cta" type="button" onClick={()=>{setmob(!mob)}} className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none ring-2 ring-gray-400" aria-controls="navbar-cta" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </button>
    </div>
    {mob&&<div className="items-center justify-between  w-full md:flex md:w-auto md:order-1" id="navbar-cta">
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white  ">
        <li onClick={()=>{if(width <= 768){setmob(!mob)}}}>
          <Link to="/manager/ytd" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">YTD Analysis</Link>
        </li>
        <li onClick={()=>{if(width <= 768){setmob(!mob)}}}>
          <Link to="/manager/timecard" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">Timecards of my interns</Link>
        </li>
        <li onClick={()=>{if(width <= 768){setmob(!mob)}}}>
          <Link to="/manager/profile" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">Manager Profile</Link>
        </li>
        
      </ul>
    </div>}
    </div>
  </nav>
  </>
  )
}

export default Nav3