import React, { useContext, useState } from "react";
import axios from "axios";


import InputsWithOutOtp from "./InputsWithOutOtp";
import InputsWithOtp from "./InputsWithOtp";

import { Context } from "./Context_holder";
import { Link, useNavigate } from "react-router-dom";




export default function UserLogin() {
  const {
    setusertoken,
    setuser,
    notify,
    
  
  } = useContext(Context);

  const [loginMethod, setLoginMethod] = useState("phone");


  const [loader,setloder]= useState(false);


 const navigator=useNavigate()

  const [phone, setPhone] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  


  const loginOptions = [
    { method: "otp", label: "Login with OTP" },
    { method: "phone", label: "Login with Phone" },
    { method: "email", label: "Login with Email" },
   
  ];

  


  const handleSendOtp = () => {

    if (!phone) return notify("Please enter your phone number", 0);
    setloder(true)

    axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_OTP_URL}/otp_send`, { phone:phone })
      .then((res) => {
        notify(res.data.msg, res.data.status);
        if (res.data.status === 1) setOtpSent(true);
      })
      .catch((error) => notify("Error sending OTP", 0))
       .finally(() => setloder(false));
  };

  const handleVerifyOtp = () => {
    setloder(true)

    axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}loginWithOtp`, { phone:phone.replace("+", ""), otp })
      .then((res) => {
        notify(res.data.msg, res.data.status);
        if (res.data.status === 1) {
          setuser(res.data.user);
          setusertoken(res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("usertoken", res.data.token);
          
          setOtpSent(false)
          setPhone(null)
           navigator("/userprofile")
         
        }
      })
      .catch(() => notify("OTP verification failed", 0))
       .finally(() => setloder(false));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const data = { password };
    if (loginMethod === "phone") data.phone = phone.replace("+","");
    else data.email = e.target.email.value;
    setloder(true)

    axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}/login`, data)
      .then((success) => {
       
        
        notify(success.data.msg, success.data.status);
        if (success.data.status === 1) {
          e.target.reset();
          setuser(success.data.user);
          setusertoken(success.data.token);
          localStorage.setItem("user", JSON.stringify(success.data.user));
          localStorage.setItem("usertoken", success.data.token);
          
          
          setPhone(null)
           navigator("/userprofile")

        }
      })
      .catch(() => notify("Login failed", 0))
       .finally(() => setloder(false));
  };

  return (
  <div className="px-3 w-full py-4 h-screen bg-[#000000]">
  <div className="w-full max-w-md p-8 mx-auto bg-[#000000] border border-[#FFD700] rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center text-[#FFD700]">Student Login</h2>

    <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold mb-3">
      {loginOptions?.map(({ method, label }) => (
        <button
          key={method}
          onClick={() => {
            setLoginMethod(method);
            setOtpSent(false);
          }}
          className={`px-2 py-1 rounded border ${
            loginMethod === method
              ? "bg-[#FFD700] text-black"
              : "bg-black border-[#FFD700] text-[#FFD700]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    {loginMethod === "otp" ? (
      <InputsWithOtp
        otpSent={otpSent}
        phone={phone}
        setOtp={setOtp}
        handleSendOtp={handleSendOtp}
        otp={otp}
        handleVerifyOtp={handleVerifyOtp}
        setOtpSent={setOtpSent}
        setPhone={setPhone}
        loader={loader}
      />
    ) : (
      <InputsWithOutOtp
        handleSubmit={handleSubmit}
        loginMethod={loginMethod}
        phone={phone}
        setPhone={setPhone}
        loader={loader}
      />
    )}

    <Link
      to={"/usersignup"}
      className="mt-4 text-sm text-center justify-center items-center flex-wrap flex gap-1 text-[#FFD700]"
    >
      Don't have an account?
      <p className="underline font-bold">Sign Up</p>
    </Link>
  </div>
</div>

  );
}
