import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cheaters = () => {
  const [cheaters, setCheaters] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    reason: "",
    reportedBy: "",
    proof: null,
  });
  const [selectedProof, setSelectedProof] = useState(null);
  const API_URL = "http://localhost:4000";

  useEffect(() => {
    axios.get(`${API_URL}/allChe`)
      .then(res => setCheaters(res.data.cheaters))
      .catch(err => toast.error("Error fetching cheaters"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, proof: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, studentId, reason, reportedBy, proof } = formData;

    if (!name || !studentId || !reason || !reportedBy || !proof) {
      toast.error("All fields are required!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("studentId", studentId);
    formDataToSend.append("reason", reason);
    formDataToSend.append("reportedBy", reportedBy);
    formDataToSend.append("proof", proof);

    try {
      await axios.post(`${API_URL}/addChe`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cheater reported successfully!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error("Failed to add cheater!");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚨 Report a Cheater</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" className="w-full p-3 border rounded-lg" onChange={handleChange} />
          <input type="text" name="studentId" placeholder="Student ID" className="w-full p-3 border rounded-lg" onChange={handleChange} />
          <input type="text" name="reportedBy" placeholder="Reported By" className="w-full p-3 border rounded-lg" onChange={handleChange} />
          <textarea name="reason" placeholder="Reason" className="w-full p-3 border rounded-lg" onChange={handleChange}></textarea>
          <input type="file" className="w-full p-3 border rounded-lg" onChange={handleFileChange} />
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Submit Report</button>
        </form>
      </div>

      <div className="mt-8 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Cheaters List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Student ID</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Reported By</th>
                <th className="p-3">Proof</th>
              </tr>
            </thead>
            <tbody>
              {cheaters.length > 0 ? (
                cheaters.map((cheater) => (
                  <tr key={cheater._id} className="border-t hover:bg-gray-100">
                    <td className="p-3">{cheater.name}</td>
                    <td className="p-3">{cheater.studentId}</td>
                    <td className="p-3">{cheater.reason}</td>
                    <td className="p-3">{cheater.reportedBy}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => setSelectedProof(cheater.proofUrl)}
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">No cheaters reported yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProof && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button onClick={() => setSelectedProof(null)} className="text-red-600 mb-2">Close</button>
            {selectedProof.endsWith(".pdf") ? (
              <iframe src={selectedProof} className="w-full h-[500px] border rounded" title="Proof Preview"></iframe>
            ) : (
              <img src={selectedProof} alt="Proof" className="max-w-full h-auto rounded shadow" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cheaters;
