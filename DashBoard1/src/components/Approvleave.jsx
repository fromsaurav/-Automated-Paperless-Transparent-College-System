import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();
      if (data.success) {
        setLeaves(data.leaves);
      } else {
        toast.error("Failed to fetch leave applications");
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Error fetching leave applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Leave ${status.toLowerCase()} successfully!`);
        fetchLeaves();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating leave status");
    }
  };

  const viewPdf = (url) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Leave Applications</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Reason</th>
                <th className="py-3 px-6 text-left">Start Date</th>
                <th className="py-3 px-6 text-left">End Date</th>
                <th className="py-3 px-6 text-left">Proof</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="border-b border-gray-700">
                  <td className="py-3 px-6">{leave.name}</td>
                  <td className="py-3 px-6">{leave.email}</td>
                  <td className="py-3 px-6">{leave.reason}</td>
                  <td className="py-3 px-6">{leave.startDate}</td>
                  <td className="py-3 px-6">{leave.endDate}</td>
                  <td className="py-3 px-6">
                    {leave.proofDocument ? (
                      <button
                        onClick={() => viewPdf(leave.proofDocument)}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 mx-1"
                      >
                        View
                      </button>
                    ) : (
                      "No Proof"
                    )}
                  </td>
                  <td className="py-3 px-6">{leave.status || "Pending"}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => updateStatus(leave._id, "Approved")}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 mx-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(leave._id, "Rejected")}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 mx-1"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />

      {/* PDF Viewer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-w-4xl">
            <h3 className="text-xl font-bold mb-4 text-center">Medical Proof</h3>
            <div className="relative">
              <iframe src={pdfUrl} className="w-full h-96 rounded-lg"></iframe>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-red-600 p-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
