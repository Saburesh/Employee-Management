import React, { useState } from 'react';
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [values, setValues] = useState({
        email : '',
        password : ''
    });


    const [error, setError] = useState(null);
    //if there is a error (in terms of wrong crediantials) then this veriable is used.
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;
    //the cookies will now reflect in the applications in developers tools. 

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result => {
          if(result.data.loginStatus){
            localStorage.setItem('valid',true)
            navigate("/dashboard")
          } else{
            setError(result.data.Error)
            //this will return the 'Error' defined in AdminRoute.js file i.e., return res.json({loginStatus: false, Error: "wrong crediantials i.e., email or password invalid :("});
          }
        })
        .catch(err => console.log(err))
    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
          {error && error}
        </div>

        <h2>Login page</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor='email'><strong>Email :</strong></label>
                <input name='email' type='email' autoComplete='off' placeholder='enter email'  onChange={(e)=> setValues({...values, email : e.target.value})} className='form-control rounded-0'/>
            </div>


            <div className='mb-3'>
                <label htmlFor='password'><strong>Password :</strong></label>
                <input name='password' type='password'  placeholder='enter password' onChange={(e)=> setValues({...values, password : e.target.value})} className='form-control rounded-0'/>
            </div>

            <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>

            <div className='mb-1'>
                <input type="checkbox" name="tick" id="tick" className='me-2' />
                <label htmlFor='password'>you agree with terms & conditions</label>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login
