import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheatersTable = () => {
  const [cheaters, setCheaters] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const API_URL = "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${API_URL}/allChe`)
      .then((res) => setCheaters(res.data.cheaters))
      .catch((err) => console.error("Error fetching cheaters:", err));
  }, []);

  const handleViewProof = (proofUrl) => {
    if (!proofUrl) {
      toast.error("Proof not available!");
      return;
    }
    setSelectedProof(proofUrl);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-8 text-center text-red-400">🚨 Reported Cheaters</h2>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {cheaters.length > 0 ? (
          cheaters.map((cheater) => (
            <div
              key={cheater._id}
              className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 transition transform hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-red-300 mb-3">{cheater.name}</h3>
              <p className="text-gray-300 text-lg">
                <strong>🎓 Student ID:</strong> {cheater.studentId}
              </p>
              <p className="text-gray-300 text-lg mt-2">
                <strong>⚠️ Reason:</strong> {cheater.reason}
              </p>
              <p className="text-gray-300 text-lg mt-2">
                <strong>📢 Reported By:</strong> {cheater.reportedBy}
              </p>
              <button
                onClick={() => handleViewProof(cheater.proofUrl)}
                className="mt-5 bg-blue-600 text-white py-2 px-5 text-lg rounded-lg hover:bg-blue-500 transition duration-300"
              >
                View Proof
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-2 text-xl">
            No cheaters reported yet.
          </p>
        )}
      </div>

      {/* Proof Preview Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-3xl w-full border border-gray-600">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">🧾 Proof Preview</h3>
            <button
              onClick={() => setSelectedProof(null)}
              className="text-red-500 text-lg mb-2 hover:underline float-right"
            >
              Close
            </button>
            {selectedProof.endsWith(".pdf") ? (
              <iframe
                src={selectedProof}
                className="w-full h-[600px] border rounded-lg"
                title="Proof Preview"
              ></iframe>
            ) : (
              <img
                src={selectedProof}
                alt="Proof"
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatersTable;
