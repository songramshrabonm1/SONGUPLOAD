import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

const Otp = () => {
  const otpNumber = 6;
  const [InputArray, setInputArray] = useState(new Array(otpNumber).fill(""));
  const refArray = useRef([]);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    refArray?.current[0]?.focus();
  }, []);

  const [second, setSecond] = useState(5);
  const [minute, setMinute] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (second > 0) {
        setSecond(second - 1);
      }
      if (second === 0) {
        if (minute === 0) {
          clearInterval(interval);
        } else {
          setMinute(minute - 1);
          setSecond(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [second, minute]);

  const ResendOtp = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/auth/resendOtp`, {
        withCredentials: true,
      });
      setMinute(1); 
      setSecond(5);
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const VerfiyOtp = async () => {
    try {
        console.log(InputArray, Array.isArray(InputArray)); 
      const OtpData = InputArray.join("");
      console.log('OtpData' , OtpData); 
      const res = await axios.post(
        `http://localhost:3000/api/auth/OTP`,
        { email, otp: OtpData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log(res.message);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChange = (value, index) => {
    if (isNaN(value) || value === " ") return;

    const newArray = [...InputArray];
    newArray[index] = value.slice(-1);
    setInputArray(newArray);

    if (value && refArray.current[index + 1]) {
      refArray?.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (event, index, value) => {
    if (event.key === "Backspace" && !value) {
      refArray?.current[index - 1]?.focus();
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-4xl font-bold font-serif flex justify-center mt-20">
        Enter the 6-digit code sent <br></br> to your email
      </p>
      <div className="flex flex-wrap  justify-center items-center">
        {InputArray.map((input, index) => {
          return (
            <div key={index} style={{ display: "flex ", alignItems: "center" }}>
              {index === 3 && <p style={{ margin: "0px 8px" }}>-</p>}
              <input
                value={input}
                type="text"
                onChange={(event) => handleChange(event.target.value, index)}
                onKeyDown={(event) =>
                  handleKeyDown(event, index, event.target.value)
                }
                ref={(element) => {
                  refArray.current[index] = element;
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid green",
                  margin: "5px",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontSize: "24px",
                  outline: "red",
                }}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-green-200">
        Time Remaining -{minute < 10 ? ` 0${minute} ` : ` ${minute}`} :{" "}
        {second < 10 ? ` 0${second} ` : second}
      </p>
      {/* className="border cursor-pointer hover:border-green-300 border-gray-400 rounded-4xl p-2 flex my-7" */}
      <button
        onClick={ResendOtp}
        disabled={second > 0 || minute > 0}
        className={
          second > 0 || minute > 0
            ? "hidden"
            : "border cursor-pointer hover:border-green-300 border-gray-400 rounded-4xl p-2 flex my-7"
        }
      >
        RESEND OTP
      </button>
      <button
        onClick={VerfiyOtp}
        className="btn cursor-pointer  bg-green-400 rounded-4xl md:px-30 sm:px-20 text-black font-bold font-serif"
      >
        Verify
      </button>
    </div>
  );
};

export default Otp;
