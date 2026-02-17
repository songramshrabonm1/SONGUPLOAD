import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
const Login = () => {
    const [data, setData] = useState({
      Confirmpassword: "",
      email: "",
      password: "",
    });
    const navigate = useNavigate() ; 
    const handleChange = (e)=>{
        const {name , value} = e.target; 
        console.log('name: ' , name);
        console.log("value", value);
        setData((prev)=>({...prev, [name]: value})) ; 

    }
    const handleSubmit = async(e)=>{
        e.preventDefault() ; 
        console.log(data);
        if (data.Confirmpassword !== data.password) {
          alert("confirm password is not match");
          return;
        }

        try{
            const res = await axios.post(
              `http://localhost:3000/api/auth/Login`,
              {
                email : data.email, 
                password : data.password 
              }, 
              {
                'headers' : {
                    "Content-Type": "application/json"
                }
              }
            );
            console.log(res.data); 
            navigate('/otp');
            
        }catch(error){
            console.error(error.message);
        }
    }
  return (
    <div className="">
      <div className=" flex flex-col justify-center items-center mt-20">
        <h1 className="text-4xl font-bold text-center  font-serif">
          Welcome Back
        </h1>
      
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <form
          className="border-green-300 border-2 rounded-2xl px-20 pb-10"
          onSubmit={handleSubmit}
        >
         
          <br></br>
          <br></br>
          <label className="font-bold  font-serif mb-7" htmlFor="email">
            Email:{" "}
          </label>
          <br />
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            required
            onChange={handleChange}
            className="border mt-1 border-green-300 rounded outline-green-600 p-4 "
          />
          <br></br>
          <br></br>
          <label className="font-bold  font-serif mb-7" htmlFor="password">
            password:{" "}
          </label>
          <br />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
            onChange={handleChange}
            className="border mt-1 border-green-300 rounded outline-green-600 p-4 "
          />
          <br></br>
          <br></br>
          <label
            className="font-bold  font-serif mb-7"
            htmlFor="Confirmpassword"
          >
            Confirm password:{" "}
          </label>
          <br />
          <input
            type="password"
            placeholder="Enter Confirm Password"
            name="Confirmpassword"
            onChange={handleChange}
            className="border mt-1 border-green-300 rounded outline-green-600 p-4 "
          />
          <br></br>

          <button
            className="btn w-full mt-10 rounded-2xl bg-green-400 hover:bg-green-700"
            type="submit"
          >
            SignIn
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login