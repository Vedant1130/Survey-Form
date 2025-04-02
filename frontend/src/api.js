if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AUTH_URL = `${BASE_URL}/auth`;
const SURVEY_URL = `${BASE_URL}/surveys`;

const LOGIN = `${AUTH_URL}/login`;
const LOGOUT = `${AUTH_URL}/logout`;
const CHECK_AUTH = `${AUTH_URL}/check-auth`;
const SIGNUP = `${AUTH_URL}/signup`;

const SUBMIT_SURVEY = `${SURVEY_URL}/submit`;
const GET_SURVEY = `${SURVEY_URL}/all`;
const DELETE_SURVEY = `${SURVEY_URL}/delete`;

export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(
      SIGNUP,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Signup API Response:", response.data);
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Sign-up failed",
    };
  }
};

export const loginUser = async (name, password) => {
  try {
    const response = await axios.post(
      `${LOGIN}`,
      { name, password },
      { withCredentials: true } // ✅ Ensures cookies are sent/received
    );

    return response.data; // ✅ No need to store the token manually
  } catch (error) {
    console.error("Login failed", error);
    return { success: false, message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${LOGOUT}`,
      {},
      { withCredentials: true } // Ensures cookies (JWT) are cleared
    );

    return {
      success: true,
      message: response.data?.message || "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Logout failed",
    };
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(CHECK_AUTH, {
      withCredentials: true, // Ensures cookies (JWT) are sent with request
    });

    return {
      success: true,
      isAuthenticated: response.data?.isAuthenticated || false,
      user: response.data?.user || null, // Include user details if authenticated
    };
  } catch (error) {
    return {
      success: false,
      isAuthenticated: false,
      user: null,
      message: error.response?.data?.message || "Authentication check failed",
    };
  }
};

export const submitSurvey = async (surveyData) => {
  try {
    const token = localStorage.getItem("token"); // ✅ Get JWT token
    console.log(localStorage.getItem("token"));

    const response = await axios.post(
      SUBMIT_SURVEY,
      { ...surveyData },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in headers
        },
        withCredentials: true, // ✅ Keep it if needed for session-based authentication
      }
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.survey,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Survey submission failed",
    };
  }
};

export const getAllSurveys = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ Get JWT token

    const response = await axios.get(GET_SURVEY, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token in headers
      },
      withCredentials: true, // ✅ Keep it if needed for session-based authentication
    });

    if (Array.isArray(response.data.surveys)) {
      return { success: true, surveys: response.data.surveys };
    } else {
      return { success: false, message: "Invalid response format" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch surveys",
    };
  }
};

export const getSurveyById = async (id) => {
  try {
    const token = localStorage.getItem("token"); // Get JWT from storage

    const response = await axios.get(`${SURVEY_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send JWT for authentication
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Survey not found",
    };
  }
};

export const deleteSurvey = async (id) => {
  try {
    const response = await axios.delete(`${DELETE_SURVEY}/${id}`, {
      withCredentials: true,
    });
    console.log(response);

    return response;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete survey",
    };
  }
};
