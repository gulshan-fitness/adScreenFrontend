import React, { useContext, useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../Context_holder'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Admin_sign_up() {
  const navigate = useNavigate()
  const { setadmin, setadminToken, notify } = useContext(Context)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
 

  const submit_signup_handler = (e) => {
    e.preventDefault()

    const name = e.target.name.value
    const email = e.target.email.value
    const contact = e.target.Contact.value
    const password = e.target.password.value
    const confirm_password = e.target.Confirm_Password.value
    const role=e.target.role.value

    const data = {
      name,
      email,
      contact,
      password,
      confirm_password,
      role
    }

    axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ADMIN_URL}sign_up`, data)
      .then((response) => {
        notify(response.data.msg, response.data.status)

        if (response.data.status === 1) {
          setadmin(response.data.admin)
          setadminToken(response.data.token)

          localStorage.setItem("admin", JSON.stringify(response.data.admin))
          localStorage.setItem("admin_token", response.data.token)
          navigate("/adminprofile")
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <Link to={"/"}>
            {/* Place logo here if needed */}
          </Link>
        </div>

        <div className="bg-black p-6 sm:p-8 rounded-md shadow-md border border-[#FFD700]">
          <div className="flex justify-center mb-4 text-[#FFD700]">
            <i className="fa-solid fa-user text-4xl sm:text-6xl"></i>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-center uppercase text-[#FFD700] mb-6">
            Admin Sign Up
          </h2>

          <form onSubmit={submit_signup_handler} className="space-y-4 text-[#FFD700]">

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border border-[#FFD700] bg-black rounded-md py-2 px-3 text-sm placeholder-[#FFD700] text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                required
                className="w-full border border-[#FFD700] bg-black rounded-md py-2 px-3 text-sm placeholder-[#FFD700] text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="Enter your email"
              />
            </div>

            {/* Contact */}
            <div>
              <label htmlFor="Contact" className="block text-sm font-medium mb-1">Contact</label>
              <input
                type="text"
                id="Contact"
                name="Contact"
                required
                className="w-full border border-[#FFD700] bg-black rounded-md py-2 px-3 text-sm placeholder-[#FFD700] text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="Enter your contact number"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
              <select
                id="role"
                name="role"
                defaultValue={"subadmin"}
                
               
                className="w-full border border-[#FFD700] bg-black rounded-md py-2 px-3 text-sm text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              >
                <option value="superadmin">Super Admin</option>
                <option value="subadmin">Sub Admin</option>

              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full border border-[#FFD700] bg-black rounded-md py-2 px-3 pr-10 text-sm placeholder-[#FFD700] text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Enter password"
                />
                <div
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-[#FFD700]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="Confirm_Password" className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="Confirm_Password"
                  name="Confirm_Password"
                  required
                  className="w-full border border-[#FFD700] bg-black rounded-md py-2 px-3 pr-10 text-sm placeholder-[#FFD700] text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Confirm your password"
                />
                <div
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-[#FFD700]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FFD700] hover:bg-[#d4af37] text-black text-sm font-semibold py-2 rounded-md transition duration-200"
            >
              Sign Up
            </button>

            {/* Already have account */}
            <Link to="/adminloginitslocked" className="text-sm text-center mt-4 block">
              Already have an account?{" "}
              <button className="text-[#FFD700] font-bold underline hover:text-[#d4af37] transition">
                Login
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
