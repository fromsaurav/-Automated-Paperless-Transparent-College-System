import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewAdmin = () => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const API_URL = "http://localhost:4000/api/v1/user/admin/addnew";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(API_URL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success(data.message);
      navigate("/");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", nic: "", dob: "", gender: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding admin");
      console.error(error);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Add New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>
          <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} required />
          <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} required />
          <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          <select className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-bold">Add Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
