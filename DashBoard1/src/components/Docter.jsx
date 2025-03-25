import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Docter = () => {
  const API_URL = "http://localhost:4000";
  const [jobApplications, setJobApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [leaveFilter, setLeaveFilter] = useState("");
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/jobApplication/getall`, {
          withCredentials: true,
        });
        setJobApplications(data.jobApplications);
        setFilteredApplications(data.jobApplications);
      } catch (error) {
        toast.error("Failed to fetch job applications.");
      }
    };
    fetchJobApplications();
  }, []);

  const handleUpdateStatus = async (jobApplicationId, value) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/jobApplication/up/${jobApplicationId}`,
        { leave: value },
        { withCredentials: true }
      );

      const updatedApplications = jobApplications.map((app) =>
        app._id === jobApplicationId ? { ...app, leave: value } : app
      );
      setJobApplications(updatedApplications);
      setFilteredApplications(updatedApplications);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  useEffect(() => {
    const filtered = jobApplications.filter((app) =>
      leaveFilter ? app.leave === leaveFilter : true
    );
    setFilteredApplications(filtered);
  }, [leaveFilter, jobApplications]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Student Leave Applications</h1>

        {/* Filter Section */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Filter Applications</h2>
          <label className="block text-sm font-medium text-gray-400 mb-2">Leave Status</label>
          <select
            value={leaveFilter}
            onChange={(e) => setLeaveFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="Yes">Approved</option>
            <option value="No">Not Approved</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-gray-300">Application List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reg Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Leave Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{app.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.reg}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.leave}
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                        className={`px-3 py-2 rounded-md text-white focus:outline-none ${
                          app.leave === "Yes" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        <option value="Yes">Approved</option>
                        <option value="No">Not Approved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApplications.length === 0 && (
              <div className="text-center text-gray-400 py-6">No applications found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docter;
