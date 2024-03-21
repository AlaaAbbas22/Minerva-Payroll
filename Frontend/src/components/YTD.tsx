import { Navigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import axios from 'axios';
import Http from "./Http";
import { TailSpin } from "react-loader-spinner";

const YTD = ({ baseURL }: {baseURL: String}) => {
      // setting vars
  const [ytd_analysis, setytd_analysis] = useState([])
  const [loading, setloading] = useState("Loading")




axios.defaults.withCredentials = true


//handling submitting mean
async function A() {
  await Http.get(`${baseURL}/ytdintern`,{
    withCredentials: true,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}})
  .then(function (response) {
    setytd_analysis(response.data.result);
    console.log(loading);
setloading("Done");
console.log(loading);
  })
  .catch(function (error) {
    console.log(error);
  });
}

var Headings = ["ID","Name","Email","PP1","PP2","PP3","PP4","PP5","PP6","PP7","PP8","PP9","PP10","PP11","PP12","PP13","PP14","PP15","PP16","PP17","PP18","PP19","Total"]

const list = ytd_analysis.map((rowIndex, index) => (
  <tr>
    <td key={index}>
      {Headings[index]}
    </td>
    <td key={index}>
      {rowIndex}
    </td>
  </tr>
))
useEffect(()=>{
  A()

}, [])



if (localStorage.getItem("logged_intern")=="false"){
  return <Navigate replace to="/intern/login" />;
}
else{
return (
(loading=="Done")&&<>
<div className="md:mx-40 my-10 " >
<h1 className='my-3 font-mono ring-2 rounded-xl bg-gradient-to-r from-cyan-700 shadow-2xl to-blue-800 text-gray-200 p-2 w-[60%] mx-auto'>YTD Analysis</h1>
  
  <table className='mx-auto nice-table text-black'>
      <thead>

      </thead>
      <tbody>
        
        {list}
        
      </tbody>
    </table>
  </div>
</>||<div className="m-auto my-20 w-40"><TailSpin
            height="140"
            width="140"
            color="#5555ff"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        /></div>
)}
}

export default YTD