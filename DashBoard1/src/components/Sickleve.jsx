import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000";

const SickLeaveManagement = () => {
  const [sickLeaves, setSickLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorMessage, setDoctorMessage] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    fetchSickLeaves();
  }, []);

  const fetchSickLeaves = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sickall`);
      const data = await response.json();
      if (data.success && Array.isArray(data.sickLeaves)) {
        setSickLeaves(data.sickLeaves);
      } else {
        setSickLeaves([]);
        toast.error("Failed to fetch sick leave applications");
      }
    } catch (error) {
      console.error("Error fetching sick leaves:", error);
      toast.error("Error fetching sick leave applications");
      setSickLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/sickupdate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Sick leave ${status.toLowerCase()} successfully!`);
        fetchSickLeaves();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating sick leave status");
    }
  };

  const sendDoctorMessage = async () => {
    if (!doctorMessage.trim()) {
      toast.error("Doctor's message cannot be empty!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/send-doctor-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail, message: doctorMessage }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Doctor's note sent successfully!");
        setShowDoctorModal(false);
        setDoctorMessage("");
      } else {
        toast.error("Failed to send doctor's note");
      }
    } catch (error) {
      console.error("Error sending doctor's note:", error);
      toast.error("Error sending doctor's note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Sick Leave Applications</h2>
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
              {sickLeaves.map((leave) => (
                <tr key={leave._id} className="border-b border-gray-700">
                  <td className="py-3 px-6">{leave.name}</td>
                  <td className="py-3 px-6">{leave.email}</td>
                  <td className="py-3 px-6">{leave.reason}</td>
                  <td className="py-3 px-6">{leave.startDate}</td>
                  <td className="py-3 px-6">{leave.endDate}</td>
                  <td className="py-3 px-6">
                    {leave.medicalProof ? (
                      <button
                        onClick={() => {
                          setPdfUrl(leave.medicalProof);
                          setShowPdfModal(true);
                        }}
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
                    <button
                      onClick={() => {
                        setSelectedEmail(leave.email);
                        setShowDoctorModal(true);
                      }}
                      className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700 mx-1"
                    >
                      Doctor's Note
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
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-w-4xl">
            <h3 className="text-xl font-bold mb-4 text-center">Medical Proof</h3>
            <iframe src={pdfUrl} className="w-full h-96 rounded-lg"></iframe>
            <button
              onClick={() => setShowPdfModal(false)}
              className="mt-4 w-full bg-red-600 p-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Doctor's Note Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-center">Send Doctor's Note</h3>
            <textarea
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              rows="4"
              placeholder="Enter doctor's message..."
              value={doctorMessage}
              onChange={(e) => setDoctorMessage(e.target.value)}
            ></textarea>
            <button
              onClick={sendDoctorMessage}
              className="mt-4 w-full bg-green-600 p-2 rounded hover:bg-green-700"
            >
              Send Message
            </button>
            <button
              onClick={() => setShowDoctorModal(false)}
              className="mt-2 w-full bg-red-600 p-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SickLeaveManagement;
