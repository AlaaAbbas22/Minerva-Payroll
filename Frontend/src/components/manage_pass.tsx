import  { useEffect, useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';
import SearchableDropdown from './SearchableDropdown';


const ManagePass = ({ baseURL }: {baseURL: String}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([{ id: 1, name: "Loading...", key:"Loading..." }]);
  const [loading, setloading] = useState('Done');
  const [button, setbutton] = useState("Change Password/Address")

  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    
    
    await Http.post(`${baseURL}/admin/change_creds`, {
      email: username,
      password:password,
    }).then((response)=>{
      console.log(response.data)
      if (response.data.result == "Unauthorized"){
        setbutton("Unauthorized")
        setloading("Done")
      }
      else if (response.data.result == "Success")
      {
        setUsername("")
        setPassword("")
        setValue("")
        setbutton("Changed!")
        setloading("Done");
    }
      else{
        setbutton("Error!");
        setloading("Done");
      }
    }).catch((e)=>{
      console.log(e);
      setbutton("Error! Try again.")
      setloading("Done")
    });
      
  };


useEffect( ()=>{
   Http.get(`${baseURL}/admin/get_users`).then((response)=>{
    var list: { id: number, name: string, key:string }[] = response.data.result.map((item:string, i:Number)=>
      ({ id: i, name: item, key:item })
    )
    setUsers(list)
   })
},[])

  const [value, setValue] = useState("Select option...");


  return (
    loading=="Done"&&<div className="">
        
        
      <form className="login-form bg-black mx-auto mt-6 min-w-[30%]" onSubmit={handleSubmit}>
        <h2 className='text-3xl mb-5'>Manage Passwords of Managers/Interns</h2>
        <label htmlFor="">Search user by email</label>
        <SearchableDropdown
        options={users}
        label="name"
        id="id"
        selectedVal={value}
        handleChange={(val: string) => {setValue(val)}}
        handleClick={(e: string) => { setUsername(e)}}
      />
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className='text-black'
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        
        <button type="submit">{button}</button>

      </form>
    </div>||<div className="m-auto my-20 w-40"><TailSpin
            height="140"
            width="140"
            color="#5555ff"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        /></div>
  );
};

export default ManagePass;
