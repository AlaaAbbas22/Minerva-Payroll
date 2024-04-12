import  { useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';
const Login = ({ baseURL }: {baseURL: String}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState('Done');
  const [button, setbutton] = useState("Login")

  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    localStorage.setItem('logged_intern', "true");
    
    await Http.post(`${baseURL}/login`, {
      email: username,
      password:password,
    }).then((response)=>{
      console.log(response.data)
      if (response.data.result != "Not found")
      {localStorage.setItem('manager', response.data["manager"]);
      localStorage.setItem('email_intern', response.data["Student Email"]);
      localStorage.setItem('intern_name', response.data["Student Name"]);
      localStorage.setItem('intern_manager', response.data["Manager Name"]);
      localStorage.setItem('intern_manager_email', response.data["Work Email"]);
      localStorage.setItem('intern_department', response.data["Department "]);
      localStorage.setItem('intern_id', response.data["StudentId"]);
      window.location.replace("/");
    }
      else{
        setbutton("Error! Try again.");
        setloading("Done");
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
        <h2 className='text-3xl mb-5'>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Username (email)</label>
          <input
            className='text-black'
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

export default Login;
