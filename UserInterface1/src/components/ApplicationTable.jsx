import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000";

const ApplicationTable = () => {
  const [applications, setApplications] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/list`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error fetching applications");
    }
  };

  return (
    <div className="container mx-auto p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mt-6 mb-4 text-center">Submitted Applications</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 text-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Applicant Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Faculty</th>
              <th className="p-3 text-left">Dean</th>
              <th className="p-3 text-left">Director</th>
              <th className="p-3 text-left">PDF</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{app.title}</td>
                  <td className="p-3">{app.category}</td>
                  <td className="p-3">{app.applicant.name}</td>
                  <td className="p-3">{app.applicant.email}</td>
                  <td className="p-3">{app.facultyStatus || "Pending"}</td>
                  <td className="p-3">{app.deanStatus || "Pending"}</td>
                  <td className="p-3">{app.directorStatus || "Pending"}</td>
                  <td className="p-3">
                    {app.pdfs.length > 0 ? (
                      <button
                        onClick={() => setSelectedPdf(app.pdfs[0].url)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                      >
                        View PDF
                      </button>
                    ) : (
                      "No PDF"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-400">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PDF Viewer */}
      {selectedPdf && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Viewing PDF</h3>
          <iframe
            src={selectedPdf}
            title="PDF Viewer"
            className="w-full h-[500px] border-none"
          ></iframe>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ApplicationTable;
