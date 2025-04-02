import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-16 px-4">
        <div className="text-center max-w-xl sm:max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Welcome to EasySurvey
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-3">
            Your feedback matters! Participate in surveys.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/survey-form")}
              className="bg-purple text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Take a Survey
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
