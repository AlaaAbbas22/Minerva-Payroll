import  { useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';

const AddIntern = ({ baseURL }: {baseURL: String}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [project, setProject] = useState('');
  const [loading, setloading] = useState('Done');
  const [button, setbutton] = useState("Add Student")

  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    
    
    await Http.put(`${baseURL}/admin/add_intern`, {
      studentEmail: username,
      password:password,
      department: department,
      managerName:managerName,
      managerEmail: managerEmail,
      studentId:studentId,
      studentName: studentName,
      project:project,
    }).then((response)=>{
      console.log(response.data)
      if (response.data.result == "Unauthorized"){
        setbutton("Unauthorized")
      }
      else if (response.data.result != "Already Exits")
      {
        setUsername("")
        setPassword("")
        setDepartment("")
        setManagerName("")
        setManagerEmail("")
        setStudentId("")
        setStudentName("")
        setProject("")
        setbutton("Added!")
        setloading("Done");
    }
      else{
        setbutton("Already Exits");
        setloading("Done");
      }
    }).catch((e)=>{
      console.log(e);
      setbutton("Error! Try again.")
      setloading("Done")
    });
      
  };

  return (
    loading=="Done"&&<div className="">
      <form className="login-form bg-black mx-auto mt-6 min-w-[30%]" onSubmit={handleSubmit}>
        <h2 className='text-3xl mb-5'>Adding Intern</h2>
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
          <label htmlFor="password">Password (Applied if first-time user only)</label>
          <input
            className='text-black'
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Student Name">Student Name</label>
          <input
            className='text-black'
            type="text"
            id="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Manager Name">Manager Name</label>
          <input
            className='text-black'
            type="text"
            id="Manager Name"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Manager Name">Manager Email</label>
          <input
            className='text-black'
            type="text"
            id="Manager Email"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Department">Department</label>
          <input
            className='text-black'
            type="text"
            id="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Student ID">Student ID</label>
          <input
            className='text-black'
            type="text"
            id="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Project">Project</label>
          <input
            className='text-black'
            type="text"
            id="Project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
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

export default AddIntern;
