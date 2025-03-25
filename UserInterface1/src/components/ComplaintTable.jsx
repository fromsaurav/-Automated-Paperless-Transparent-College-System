import { useState, useEffect } from "react";
import axios from "axios";

const ComplaintTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [visibleMedia, setVisibleMedia] = useState(null);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/comall");
        setComplaints(data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="container mx-auto mt-6 p-4 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-center">Complaints</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div key={complaint._id} className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold">{complaint.description}</h3>
              <p className="text-gray-400">By: {complaint.studentName}</p>
              <p className="text-gray-400">Email: {complaint.studentEmail}</p>
              <p className="text-gray-400">Votes: {complaint.adminVotes}</p>
              <p className="text-gray-400">Status: {complaint.status}</p>
              {complaint.media ? (
                <button
                  onClick={() => setVisibleMedia(visibleMedia === complaint.media ? null : complaint.media)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  View Media
                </button>
              ) : (
                <p className="text-gray-500">No Media</p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No Complaints Found</p>
        )}
      </div>

      {/* Media Preview Section */}
      {visibleMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4">
          <div className="relative bg-gray-900 p-4 rounded-lg shadow-lg max-w-3xl w-full">
            <button
              onClick={() => setVisibleMedia(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
            >
              Close
            </button>
            <iframe
              src={visibleMedia}
              className="w-full h-96 border border-gray-700 rounded-lg shadow-lg"
              allow="autoplay"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;