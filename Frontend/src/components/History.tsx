import Getter from "./Http"
import { useState, useEffect } from "react"

const History = ({baseURL}: {baseURL: String}) => {
    const [num, setnum] = useState(0)
    const [MyHistory, setMyHistory] = useState([<div className="text-slate-900 text-3xl p-5"></div>])


  const deleteitem = async (e: any) => {
    await Getter.post(`${baseURL}/deleteitem`,{id: e.target.id}, {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'
  }}), setnum(Math.random())
  }

    async function Get_history() { await Getter.get(`${baseURL}/gethistory`, {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'
  }}).then( function (response) {
    let newc: Array<JSX.Element> = []
    if (response.data.result[0] == "No history"){
      newc = [<div className="text-slate-900 text-3xl p-5"> No history</div>]
      setMyHistory(newc)
    } else {
    response.data.result.map((item: Array<Array<String|Array<String>>>, index: Number)=>{
      let elem: Array<JSX.Element> = []
      item.map((i: Array<String|Array<String>>, ix: Number)=>{
        if (ix == item.length-1){
          
          i.map((it, lastindex)=>elem.push(<span className="indent-8 p-3  "><a href={String(it)} target="_blank" className="text-blue-700 hover:underline">Dataset ({lastindex+1})</a><br/></span>)  )
        } else {
        elem.push(<span className="indent-8 p-3">{i}<br/></span>)}
      }),
      newc.unshift(<li key={String(index)} style={{margin: "3% 5% ", padding:"3%"}} className="text-black md:text-xl text-sm text-left rounded-3xl border bg-gray-100 relative" id={String(index)}>{...elem}<br/><br/><button id={String(index)} className="bg-white rounded-3xl ring-2 ring-black absolute right-5 bottom-4 md:text-xl text-sm" onClick={deleteitem}>Delete</button></li>)
    },
    setMyHistory(newc)
    )}});}

    async function Clear_history() { await Getter.post(`${baseURL}/clearhistory`, {}, {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'
  }}).then( () => {
        setMyHistory([<div className="text-slate-900 text-3xl p-5"> No history</div>])
    });}



    useEffect(()=>{
      Get_history()
    }, [num])
    
  return (
    <><h1 className="m-3">History</h1><div style={{}} className="md:px-60 px-4"><div className="p-5"><div className="md:text-lg text-[12px]"><button onClick={Get_history} className="text-black"> Retrieve the history </button> <button onClick={Clear_history} className="text-black"> Clear the history</button></div></div><div className="bg-white min-h-screen rounded-3xl text-black p-1">{MyHistory}</div></div>
    </>
  )
}

export default History