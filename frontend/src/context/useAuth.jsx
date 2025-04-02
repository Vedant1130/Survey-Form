import { useState, useEffect, createContext, useContext } from "react";
import { loginUser, logoutUser, checkAuthStatus, signupUser } from "../api";
import { showToast } from "../Components/ToastNotification/ToastNotification";
import Loader from "../Components/Loader/Loader"; // ✅ Import the Loader Component
import { useNavigate, useNavigation } from "react-router-dom";

const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loader for checking auth status
  const [authLoading, setAuthLoading] = useState(false); // Loader for login/logout
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check Auth Status on Page Load
  useEffect(() => {
    const fetchAuthStatus = async () => {
      setLoading(true); // Ensure loading state is set before fetching

      const response = await checkAuthStatus();

      if (response.success && response.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    };

    fetchAuthStatus();
  }, []);

  // Login Function
  const login = async (username, password) => {
    try {
      const response = await loginUser(username, password);

      if (response.success) {
        setIsAuthenticated(true);
        setUser({ name: response.name }); // ✅ Set user state correctly

        // ✅ Store JWT token securely
        if (response.token) {
          localStorage.setItem("token", response.token);
        } else {
          console.warn("Token not received from backend!");
        }

        // ✅ Show success message if you use a toast system
        // showToast("Login Successful! ✅", "success");
      } else {
        throw new Error(response.message || "Login Failed!");
      }

      return response;
    } catch (error) {
      console.error("Login Error:", error.message);

      // ✅ Show error message (if using toast notifications)
      // showToast(error.message || "An unexpected error occurred", "error");

      return { success: false, message: error.message || "Login failed" };
    }
  };

  // Sign Up Function
  const signup = async (name, email, password) => {
    setAuthLoading(true);
    try {
      const response = await signupUser(name, email, password);

      if (response.success) {
        showToast("Signup successful! Proceed to login!!", "success");
      } else {
        showToast(response.message || "Signup failed", "error");
      }
      return response;
    } catch (error) {
      console.error("Signup Error:", error);
      showToast("Signup failed. Please try again.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout Function
  const logout = async () => {
    const response = await logoutUser();

    if (response.success) {
      setIsAuthenticated(false);
      setUser(null);

      // ✅ Clear JWT token from localStorage
      localStorage.removeItem("token");
      localStorage.setItem("loggedOut", "true"); // Optional flag for UI behavior

      showToast("Logged out successfully! ✅", "success");

      // ✅ Redirect user to login page
      navigate("/login");
    } else {
      showToast("Logout failed. Please try again!", "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        authLoading,
        login,
        logout,
        signup,
        user,
      }}
    >
      {/* Show Loader while checking authentication */}
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth
export const useAuth = () => useContext(AuthContext);
