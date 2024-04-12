
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';

const TimecardManagers = ({ baseURL }: {baseURL: String}) => {
      // setting vars
  const [PP, setPP] = useState("")
  const [Week1, setWeek1] = useState(0)
  const [Week2, setWeek2] = useState(0)
  const [tasks, settasks] = useState("")
  
  const [button, setbutton] = useState("Update")
  const [buttoncolor, setbuttoncolor] = useState("slate-50")
  const [bginputcolor, setbginputcolor] = useState("")
  const [current_pp, setcurrent_pp] = useState("")
  const [loading, setloading] = useState("Loading")
  const [start, setstart] = useState("")
  const [end, setend] = useState("")
  const [deadline, setdeadline] = useState("")
  const [manager_approval, setmanager_approval] = useState("")
  const [interns, setinterns] = useState([""])
  const [emails, setemails] = useState([""])
  const [selectedintern, setselectedintern] = useState("")
  const [managercomments, setmanagercomments] = useState("")




async function A(PP: string) {
  await Http.post(`${baseURL}/gettimecardmanagers`, {
    PP: PP,
  })
  .then(function (response) {
    setinterns(response.data.names)
    setemails(response.data.emails)
  })
  .catch(function (error) {
    console.log(error);
  });
}


async function getinterntimecard(PP: string, intern:string) {
    if (intern){
    await Http.post(`${baseURL}/managercardgetter`, {
      PP: PP,
      intern:intern,
    })
    .then(function (response) {  
      setWeek1(response.data.result[0]);
      setWeek2(response.data.result[1]);
      setstart(response.data.start);
      setend(response.data.end);
      setdeadline(response.data.deadline);
      settasks(response.data.tasks);
      setmanagercomments(response.data.managercomments);
      setmanager_approval(response.data.manager_approval);
      
      if (Number(PP.slice(2))<Number(current_pp)-1){
        setbginputcolor("bg-yellow-300")
      } else {
        setbginputcolor("")
      }
      setloading("Done");
    })
    .catch(function (error) {
      console.log(error);
    });
    }
  }



// Update PP values
async function update_PP() {
  setloading("Loading")
  await Http.post(`${baseURL}/manager_update_timecard`, {
    Weeks: [Week1, Week2],
    PP: PP,
    approval: manager_approval,
    intern:selectedintern,
    managercomments:managercomments,

  })
  .then(function (response) {
    if (response.data.result == "Done!"){
    
    setbuttoncolor("emerald-600");}
    else {setbutton(response.data.result);
      setbuttoncolor("red-600");}
    setloading("Done")
  })
  .catch(function (error) {
    console.log(error);
    setloading("Done")
  });
}

const handleSubmit = (e: React.FormEvent) =>{
  update_PP();
  e.preventDefault();
  
}  


const handleChangeweek1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeek1(e.target.valueAsNumber)
  }
  const handleChangeweek2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeek2(e.target.valueAsNumber)
  }

  useEffect(() => {
    async function getCurrent() {
      try {
        const response = await Http.get(`${baseURL}/getcurrentpp`, {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
        setcurrent_pp(response.data.result);
        setPP(`PP${response.data.result-1}`);
  
        A(`PP${response.data.result-1}`);
        setloading("Done");
      } catch (error) {
        console.error('Error fetching current PP:', error);
      }
    }

    getCurrent();
    
  }, []); // Empty dependency array ensures the effect runs only once


var timecards_orig = ["PP1","PP2","PP3","PP4","PP5","PP6","PP7","PP8","PP9","PP10","PP11","PP12","PP13","PP14","PP15","PP16","PP17","PP18","PP19"]
const timecards = timecards_orig.filter((pp)=>Number(pp.slice(2))<=Number(current_pp))
console.log(timecards)
if (localStorage.getItem("logged_intern")=="false"){
  return <Navigate replace to="/login" />;
}
else{
return (
loading=="Done"&&<>
<div className="md:mx-40 mb-10 mt-6" >
<h1 className='my-3 font-sans ring-2 rounded-xl bg-gradient-to-r from-cyan-700 shadow-2xl to-blue-800 text-gray-200 p-2 w-[60%] mx-auto'>Timecards</h1>
  <form onSubmit={handleSubmit} id= "frm1" className="p-1 ">

    <select value={PP} onChange={(e)=>{setPP(e.target.value); setloading("Loading"); getinterntimecard(e.target.value, selectedintern); setbuttoncolor("slate-50"); setbutton("Update")}} className='text-black m-2 '>
         
          {timecards.map((selected_PP)=><option value={selected_PP}>{selected_PP}</option>)}
        </select>
        <select value={selectedintern} onChange={(e)=>{setselectedintern(e.target.value); setloading("Loading"); getinterntimecard(PP,e.target.value); setbuttoncolor("slate-50"); setbutton("Update")}} className='text-black m-2 '>
         <option value=""></option>
         {interns.map((intern, ind)=><option value={emails[ind]}>{intern}</option>)}
       </select>

  </form>
  {selectedintern&&<><table className='mx-auto nice-table text-black'>
      <thead>

      </thead>
      <tbody>
        
      
          <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900 `}>
                Start of Pay Period
            </td>
            </tr>
            <tr >
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-xl font-mono `}>
                {start}
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900 `}>
                End of Pay Period
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-xl font-mono `}>
                {end}
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900 `}>
                <span className='text-red-500'>(Deadline to approve hours)</span>
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-xl font-mono `}>
                {deadline} Pacific Time
            </td>
            </tr>
            <tr>
            <td className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900`}>
                Week 1
            </td>
            <td >
                <input disabled={Number(PP.slice(2))+1==Number(current_pp) ? false : true} type='number' name= "numbers" id = "large-input" value = {Week1} placeholder='Type a number' className={`mycenter block w-full md:p-5 p-2 text-sm md:text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500  font-mono ${bginputcolor}`} onChange={handleChangeweek1}>
                </input>
            </td>
          </tr>
          <tr>
            <td className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900`}>
                Week 2
            </td>
            <td >
                <input disabled={Number(PP.slice(2))+1==Number(current_pp) ? false : true} type='number' name= "numbers" id = "large-input" value = {Week2} placeholder='Type a number' className={`mycenter block w-full md:p-5 p-2 text-sm md:text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 font-mono ${bginputcolor}`} onChange={handleChangeweek2}>
                </input>
            </td>
          </tr>
          <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900`}>
                Comments/Tasks Completed
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl`}>
                <textarea disabled name= "tasks" id = "large-input" value = {tasks} placeholder='List tasks completed during this pay period' className={`mycenter block w-full md:p-5 p-2 text-sm md:text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 font-mono bg-${bginputcolor}`} onChange={(e)=> settasks(e.target.value)}>
                </textarea>
            </td>
            </tr>

            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl text-blue-900`}>
                Manager Approval
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl`}>
                <select disabled={Number(PP.slice(2))+1==Number(current_pp) ? false : true} name= "tasks" id = "large-input" value = {manager_approval} onChange={(e)=>{setmanager_approval(e.target.value)}} className={`mycenter block w-full md:p-5 p-2 text-sm md:text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 font-mono ${manager_approval=="YES"&&`bg-green-500`||manager_approval=="NO"&&`bg-red-500`||`bg-blue-300`}`}>
                    <option value=""></option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                    
                </select>
            
            </td>
            </tr>
            <tr>
            <td colSpan={2} className={`md:p-5 p-2 text-sm md:text-2xl`}>
                <textarea disabled={Number(PP.slice(2))+1==Number(current_pp) ? false : true} name= "tasks" id = "large-input" value = {managercomments} placeholder='Manager Comments to payroll team if any' className={`mycenter block w-full md:p-5 p-2 text-sm md:text-xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 font-mono ${bginputcolor}`} onChange={(e)=> setmanagercomments(e.target.value)}>
                </textarea>
            </td>
            </tr>
            
            
        
      </tbody>
    </table>
    {Number(PP.slice(2))+1==Number(current_pp)&&<button onClick= {handleSubmit} className={`text-black text-xl mt-3 bg-${buttoncolor} w-[30%]`}>
      {button}
    </button>}</>}
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

export default TimecardManagers