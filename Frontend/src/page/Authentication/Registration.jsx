import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const Registration = () => {
  const [valuee, setValue] = useState({
    userName: "",
    email: "",
    password: "",
    Confirmpassword: "",
  });
  const navigate = useNavigate() ;

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(valuee);
    if (valuee.Confirmpassword !== valuee.password) {
      alert("Confirm password is not match...");
      return;
    }

    console.log(valuee.userName);
    console.log(valuee.email);
    console.log(valuee.password);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/Registration`,
        {
          userName: valuee.userName,
          email: valuee.email,
          password: valuee.password,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
      console.log(res.data);
      navigate("/login"); 
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <div className=" flex flex-col justify-center items-center mt-20">
        <h1 className="text-4xl font-bold text-center  font-serif">
          Sign up To
        </h1>
        <h1 className="text-4xl font-bold text-center  font-serif">
          Start Your Music
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <form
          className="border-red-300 border-2 rounded-2xl p-20"
          onSubmit={handleSubmit}
        >
          <label className="font-bold font-serif mb-7" htmlFor="userName">
            UserName:{" "}
          </label>
          <br />
          <input
            type="text"
            placeholder="Enter Your UserName"
            name="userName"
            onChange={handleChange}
            className="border mt-1 border-green-300 rounded outline-green-600 p-4 "
          />
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
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
