import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/useAuth";

const Navbar = () => {
  const { isAuthenticated, logout, authLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md h-16 flex justify-between items-center px-4 md:px-6 fixed w-full top-0 z-50">
      {/* Logo */}
      <Link className="text-lg md:text-xl font-bold text-gray-800" to="/">
        Easy Survey
      </Link>

      {/* User Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center bg-gray-200 p-2 md:p-3 rounded-full hover:bg-gray-300 transition"
        >
          <FiMenu className="text-lg md:text-xl mr-2" />
          <FaUserCircle className="text-lg md:text-xl" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md text-sm md:text-base">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                  {authLoading && <Loader />} {/* ✅ Show Loader */}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
