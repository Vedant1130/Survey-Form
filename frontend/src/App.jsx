import "./App.css";
import { Routes, Route, useLocation, Router, Navigate } from "react-router-dom";
import User from "./Components/User/User";
import HomePage from "./Components/Home/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Components/Dashboard/Dashboard";
import Form from "./Components/Survey Form/Form";
import { AuthProvider, useAuth } from "./context/useAuth"; // Import AuthProvider
import ProtectedRoute from "./private_route";
import ToastNotification from "./Components/ToastNotification/ToastNotification";
import ViewForm from "./Components/Survey Form/viewForm";
import ComparisonTable from "./Components/Survey Form/ComparisonTable";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ToastNotification />

      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<User />} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/survey-form" element={<Form />} />
          <Route path="/view-form/:surveyId" element={<ViewForm />} />
          <Route path="/compare-table" element={<ComparisonTable />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
