import React, { useState } from "react";
import { loginSchema, signupSchema } from "../../Schema";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useFormik } from "formik";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../ToastNotification/ToastNotification";

const User = () => {
  const [isActive, setIsActive] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Login Schema
  const loginFormik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }) => {
      const response = await login(username, password);
      if (response.success) {
        showToast("Login Successful! 🎉", "success");
        navigate("/");
      } else {
        showToast(response.message || "Login Failed! ❌", "error");
      }
    },
  });

  //Sign up Schema
  const signupFormik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: signupSchema,
    onSubmit: async ({ name, email, password }) => {
      console.log("Submitting Signup Form:", { name, email, password });
      const response = await signup(name, email, password);
      console.log("Signup API Response:", response);
      if (response.success) {
        setIsActive(false); // Switch to login after successful signup
      }
    },
  });

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-300">
      <div
        className={`relative w-full h-full bg-white shadow-2xl overflow-hidden transition-all duration-[1.8s] ${
          isActive ? "active" : ""
        }`}
      >
        {/* {/ Login Form /} */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center text-center p-10 transition-all duration-700 ${
            isActive
              ? "translate-x-full opacity-0 "
              : "translate-x-0 opacity-100 "
          }`}
        >
          <h1 className="text-4xl font-bold mb-6">Login</h1>
          <form
            className="w-full flex justify-center flex-col"
            onSubmit={loginFormik.handleSubmit}
          >
            {/* {/ Username /} */}
            <div className="relative flex flex-col justify-center items-center w-full">
              <div className="relative w-10/12">
                <input
                  name="username"
                  placeholder="Username"
                  type="text"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={loginFormik.values.username}
                  onChange={loginFormik.handleChange}
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {loginFormik.errors.username && (
                  <p className="text-red-500 text-sm">
                    {loginFormik.errors.username}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Password /} */}
            <div className="relative flex flex-col justify-center items-center w-full my-6">
              <div className="relative w-10/12">
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                />
                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {loginFormik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {loginFormik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Login Button /} */}
            <div className="relative flex justify-center items-center w-full">
              <button
                type="submit"
                className="w-10/12 bg-purple text-white py-3 rounded-lg text-lg font-semibold shadow-m"
              >
                {"Login"}
              </button>
            </div>
          </form>
        </div>

        {/* {/ Register Form /} */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center text-center p-10 transition-all duration-700 ${
            isActive
              ? "translate-x-0 opacity-100 visible"
              : "-translate-x-full opacity-0 invisible"
          }`}
        >
          <h1 className="text-4xl font-bold mb-6">Register</h1>
          <form className="w-full" onSubmit={signupFormik.handleSubmit}>
            {/* {/ Username /} */}
            <div className="relative flex flex-col justify-center items-center w-full">
              <div className="relative w-10/12">
                <input
                  name="name"
                  placeholder="Username"
                  type="text"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={signupFormik.values.name}
                  onChange={signupFormik.handleChange}
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {signupFormik.errors.username && (
                  <p className="text-red-500 text-sm">
                    {signupFormik.errors.username}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Email /} */}
            <div className="relative flex flex-col justify-center items-center w-full my-6">
              <div className="relative w-10/12">
                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={signupFormik.values.email}
                  onChange={signupFormik.handleChange}
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {signupFormik.errors.email && (
                  <p className="text-red-500 text-sm">
                    {signupFormik.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Password /} */}
            <div className="relative flex flex-col justify-center items-center w-full my-6">
              <div className="relative w-10/12">
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={signupFormik.values.password}
                  onChange={signupFormik.handleChange}
                />
                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {signupFormik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {signupFormik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Register Button /} */}
            <div className="relative flex justify-center items-center w-full">
              <button
                type="submit"
                // disabled={isRegistering}
                className="w-10/12 bg-purple text-white py-3 rounded-lg text-lg font-semibold shadow-md transition"
              >
                {"Register"}
              </button>
            </div>
          </form>
        </div>

        {/* {/ Toggle Panel /} */}
        <div
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden"
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`absolute top-0 left-0 w-full h-full bg-purple rounded-sm transition-all duration-[1.8s] ${
              isActive ? "translate-x-1/2" : "-translate-x-1/2"
            }`}
          ></div>
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center text-white transition-all duration-700 ${
              isActive ? "-translate-x-full opacity-0" : "opacity-100"
            }`}
            style={{ pointerEvents: isActive ? "none" : "auto" }}
          >
            <h1 className="text-4xl text-center font-bold mb-4">Welcome to EasySurvey!</h1>
            <p className="text-center mb-6">Your Feedback Matters.</p>
            <button
              onClick={() => setIsActive(true)}
              className="border-2 border-white px-6 py-2 rounded-lg text-lg hover:bg-white hover:text-purple transition"
              style={{ pointerEvents: "auto" }}
            >
              Register
            </button>
          </div>
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center text-white transition-all duration-700 ${
              isActive ? "opacity-100" : "translate-x-full opacity-0"
            }`}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-center mb-6">Already have an account?</p>
            <button
              onClick={() => setIsActive(false)}
              className="border-2 border-white px-6 py-2 rounded-lg text-lg hover:bg-white hover:text-purple transition"
              style={{ pointerEvents: "auto" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
