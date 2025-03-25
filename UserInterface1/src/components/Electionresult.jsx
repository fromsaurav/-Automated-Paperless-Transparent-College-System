import { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle } from "lucide-react";

const ElectionResult = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewPDF, setViewPDF] = useState({});

  const API_URL = "http://localhost:4000/candidates";

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePDF = (id) => {
    setViewPDF((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-white">Election Results</h2>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
          </div>
        ) : error ? (
          <div className="p-4 border border-red-500 text-red-500 rounded bg-gray-700">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <strong>Error:</strong>
            </div>
            <p>{error}</p>
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="p-5 bg-gray-700 rounded-lg shadow-md flex flex-col items-center text-center">
                <img
                  src={candidate.profilePhoto || "https://via.placeholder.com/100"}
                  alt={candidate.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-500"
                />
                <h3 className="text-xl font-semibold mt-3">{candidate.name}</h3>
                <p className="text-gray-300">Total Votes: <span className="font-semibold">{candidate.totalVotes}</span></p>
                <p className="text-gray-400 text-sm">
                  Male Votes: <span className="text-blue-400 font-semibold">{candidate.maleVotes} ({((candidate.maleVotes / candidate.totalVotes) * 100).toFixed(2)}%)</span> | 
                  Female Votes: <span className="text-pink-400 font-semibold">{candidate.femaleVotes} ({((candidate.femaleVotes / candidate.totalVotes) * 100).toFixed(2)}%)</span>
                </p>
                {candidate.narrativePDF && (
                  <button
                    onClick={() => togglePDF(candidate._id)}
                    className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                  >
                    {viewPDF[candidate._id] ? "Hide Narrative" : "View Narrative"}
                  </button>
                )}

                {viewPDF[candidate._id] && candidate.narrativePDF && (
                  <iframe
                    src={candidate.narrativePDF}
                    title="Candidate Narrative"
                    className="w-full h-52 mt-4 border border-gray-600 rounded-lg bg-gray-800"
                  ></iframe>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border border-gray-600 rounded bg-gray-700 text-center">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-5 w-5 mr-2 text-gray-400" />
              <strong>No Data Available</strong>
            </div>
            <p className="text-gray-300">No candidates available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionResult;