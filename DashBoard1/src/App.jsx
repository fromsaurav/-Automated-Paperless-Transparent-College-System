import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import JobApplicationDetail from "./components/JobApplicationDetail";
import JobSearch from "./components/JobSearch";
import CompanyDetailsCard from "./components/CompanyDetailsCard";
import EditCompany from "./components/EditCompany";
import Elections from "./components/Elections";
import Docter from "./components/Docter";
import Facility from "./components/Facility";
import TableAppl from "./components/TableAppl";
import ComplaintManagement from "./components/Complaintable";
import Cheaters from "./components/Cheating";
import Budget from "./components/Budget";
import BudgetDetails from "./components/BudgetDetails";
import LeaveManagement from "./components/Approvleave";
import SickLeaveManagement from "./components/Sickleve";
import "./App.css"
import FacilityDate from "./components/Dates";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } = useContext(Context);
  const API_URL = "http://localhost:4000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user/admin/me`, {
          withCredentials: true,
        });
     
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error);
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/addnew" element={<ProtectedRoute><AddNewAdmin /></ProtectedRoute>} />
        <Route path="/admin/elections" element={<ProtectedRoute><Elections /></ProtectedRoute>} />
        <Route path="/admin/docter" element={<ProtectedRoute><Docter /></ProtectedRoute>} />
        <Route path="/admin/comp" element={<ProtectedRoute><ComplaintManagement /></ProtectedRoute>} />
        <Route path="/admin/ches" element={<ProtectedRoute><Cheaters /></ProtectedRoute>} />
        <Route path="/admin/bud" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/budget/:id" element={<ProtectedRoute><BudgetDetails /></ProtectedRoute>} />
        <Route path="/admin/leavapplica" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
        <Route path="/admin/sicklea" element={<ProtectedRoute><SickLeaveManagement /></ProtectedRoute>} />
        <Route path="/job-application/:reg" element={<ProtectedRoute><JobApplicationDetail /></ProtectedRoute>} />
        <Route path="/company-details/:id" element={<ProtectedRoute><CompanyDetailsCard /></ProtectedRoute>} />
        <Route path="/edit-company/:id" element={<ProtectedRoute><EditCompany /></ProtectedRoute>} />
        <Route path="/admin/jobsearch" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
        <Route path="/admin/facility" element={<ProtectedRoute><Facility /></ProtectedRoute>} />
        <Route path="/admin/appli" element={<ProtectedRoute><TableAppl /></ProtectedRoute>} />
        <Route path="/admin/datesbook" element={<ProtectedRoute><FacilityDate /></ProtectedRoute>} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
