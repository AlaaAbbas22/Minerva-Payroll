import  { useEffect, useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';

const MyPassword = ({ baseURL, type }: {baseURL: String, type:String}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState('Done');
  const [button, setbutton] = useState("Change My Password")
  useEffect(()=>{
    Http.get(`${baseURL}/auth`).then((res)=>{
        setUsername(res.data.email)
    })
  },[])

  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    
    
    await Http.post(`${baseURL}/change_pass`, {
      password: password,
      type: type,
    }).then((response)=>{
      if (response.data.result=="success"){
      setbutton("Changed")
      setloading("Done")
    } else {
        setbutton("Error. Try again")
        setloading("Done")
    }
    }).catch((e)=>{
      console.log(e);
      setbutton("Error! Try again.")
      setloading("Done")
    });
      
  };

  return (
    loading=="Done"&&<div className="login-container">
      <form className="login-form bg-black" onSubmit={handleSubmit}>
        <h2 className='text-3xl mb-5'>Change my password</h2>
        <div className="form-group">
          <label htmlFor="email">Username (email)</label>
          <input
            
            className='text-black'
            type="text"
            id="email"
            value={username}
            disabled
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className='text-black'
            type="password"
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

export default MyPassword;
