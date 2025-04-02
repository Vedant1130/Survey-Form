import { useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../src/context/useAuth"; // Ensure the correct path
import Loader from "../src/Components/Loader/Loader";
import { showToast } from "./Components/ToastNotification/ToastNotification";
import { useState, useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false); // 🔹 Track if toast should be shown
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const isLoggedOut = localStorage.getItem("loggedOut");
      if (isLoggedOut) {
        localStorage.removeItem("loggedOut"); // ✅ Clear logout flag
        navigate("/"); // ✅ Redirect to home (not login)
      } else {
        setShowMessage(true);
      }
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (showMessage) {
      showToast("Access Denied! Please log in first.", "error");
      setShowMessage(false); // Reset to prevent repeated toasts
    }
  }, [showMessage]);

  if (loading) return <Loader />; // Don't show anything while loading auth state

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
