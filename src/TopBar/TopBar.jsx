import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import { FaUserCircle } from "react-icons/fa";

import { IoClose } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { TiArrowBack } from "react-icons/ti";
import { IoMdLogIn } from "react-icons/io";

import { Context } from "../Context_holder";

// No changes in imports

export default function TopBar() {
  const {
    isScrolled,
    user,
    logout_handler,
    isMobileMenuOpen,
    setMobileMenuOpen,
  } = useContext(Context);

  const Navigater = useNavigate();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header
      className={`transition-shadow ${
        isScrolled ? "shadow-lg" : ""
      } sticky top-0 left-0 font-sans z-50 shadow-[#FFD700]`}
    >
      <div className="bg-black text-[#FFD700]">
        <div className="mx-auto flex items-center justify-between gap-3 py-4 px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="bg-[#FFD700] rounded-full px-3 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-black font-bold text-lg">Logo</span>
            </Link>
          </div>

          {/* Desktop Navigation - Placeholder */}
          <nav className="hidden md:flex items-center gap-3 text-sm md:text-md font-semibold"></nav>

          {/* Desktop Profile & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {user && (
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <FaUserCircle className="text-2xl text-[#FFD700]" />
                  <span className="max-w-[100px] text-sm font-semibold truncate text-[#FFD700]">
                    {user?.name}
                  </span>
                </button>
              )}

              {!user && (
                <Link
                  to="/userlogin"
                  className="flex gap-1 items-center text-sm font-semibold px-3 py-1 rounded-full hover:bg-[#FFD700] hover:text-black border-2 border-[#FFD700] transition-colors duration-300"
                >
                  <IoMdLogIn className="text-lg" />
                  <span>Login</span>
                </Link>
              )}

              {/* Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 px-[1px] py-[1px] w-48 bg-black border border-[#FFD700] shadow-lg rounded-lg">
                  <Link
                    to="/userprofile"
                    className="block px-4 py-2 hover:bg-[#FFD700] rounded-md hover:text-black transition duration-300"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-[#FFD700] hover:text-black transition duration-300"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout_handler();
                      Navigater("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Icon */}
          <button
            className="md:hidden text-2xl text-[#FFD700]"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden h-screen bg-black text-[#FFD700] shadow-md">
            <nav className="flex flex-col space-y-2 px-8 py-2">
              <div className="flex flex-wrap gap-3 py-4 mt-4">
                {user && (
                  <Link
                    to="/userprofile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2"
                  >
                    <FaUserCircle className="text-2xl" />
                    <span className="max-w-[100px] text-sm font-semibold truncate">
                      {user.name}
                    </span>
                  </Link>
                )}

                {!user && (
                  <>
                    <Link
                      to="/usersignup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-[150px] text-center border-2 border-[#FFD700] px-4 py-1 rounded-full hover:bg-[#FFD700] hover:text-black transition duration-300"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/userlogin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-[150px] text-center border-2 border-[#FFD700] px-4 py-1 rounded-full hover:bg-[#FFD700] hover:text-black transition duration-300"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>

              { [
  { name: "Home", link: "" },
  { name: "About", link: "about" },
  { name: "Contact", link: "contact" },
]?.map((item) => (
                <Link
                  key={item}
                  to={`/${item?.link}`}
                  className="hover:bg-[#FFD700] hover:text-black px-3 py-2 rounded transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item?.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Logout & Back */}
            <div className="flex flex-col max-w-[170px] space-y-2 px-8 py-4">
              {user && (
                <button
                  onClick={() => {
                    logout_handler();
                    setMobileMenuOpen(false);
                    Navigater("/");
                  }}
                  className="px-4 py-1 rounded-full bg-[#FFD700] text-black flex items-center justify-center gap-2 transition duration-300"
                >
                  <AiOutlineLogout />
                  <span>Logout</span>
                </button>
              )}
              <button
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <TiArrowBack className="text-lg" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

