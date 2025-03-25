import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VotingPortal = () => {
  const API_URL = "http://localhost:4000";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVerified) {
      checkVotingStatus();
      fetchCandidates();
    }
  }, [isVerified]);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_URL}/candidates`);
      const data = await response.json();
      if (data.success) {
        setCandidates(data.candidates || []);
      } else {
        toast.error("Failed to fetch candidates.");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error.message);
      toast.error("Error fetching candidates.");
    }
  };

  const checkVotingStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/vote-status?identifier=${email}`);
      const data = await response.json();
      if (response.ok) {
        if (data.hasVoted) {
          setIsLocked(true);
          toast.info("You have already voted. Portal is locked.");
        }
      } else {
        toast.error(data.message || "Failed to check vote status.");
      }
    } catch (error) {
      console.error("Error checking vote status:", error.message);
      toast.error("Error checking vote status.");
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      toast.error("Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        toast.success("OTP verified.");
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      toast.error("Error verifying OTP.");
    }
  };

  const submitVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate before submitting.");
      return;
    }
  
    try {
      const voteResponse = await fetch(`${API_URL}/candidate/vote/${selectedCandidate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }), // Make sure email is being sent!
      });
  
      const voteData = await voteResponse.json();
  
      if (voteData.success) {
        toast.success("Vote submitted successfully!");
        setIsLocked(true);
      } else {
        toast.error(voteData.message || "Failed to submit vote.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error.message);
      toast.error("Error submitting vote.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-6 bg-gray-800 shadow-lg rounded-lg w-full w-[800px]">
        {!isVerified ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">
              {otpSent ? "Enter OTP" : "Enter Your Email"}
            </h2>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <button
                  onClick={sendOtp}
                  disabled={loading || otpSent}
                  className={`w-full bg-blue-600 text-white px-4 py-2 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mb-4 p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Verify OTP
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">Voting Portal</h2>
            {isLocked ? (
              <p className="text-center text-green-400">Voting completed. Portal is locked.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className={`p-4 rounded-lg shadow-md bg-gray-700 text-gray-200 cursor-pointer ${
                        selectedCandidate === candidate._id ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => setSelectedCandidate(candidate._id)}
                    >
                      <img
                        src={candidate.profilePhoto || "https://via.placeholder.com/100"}
                        alt={candidate.name}
                        className="h-16 w-16 rounded-full mx-auto"
                      />
                      <h3 className="text-center font-bold mt-2">{candidate.name}</h3>
                      <button
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded mt-2 hover:bg-blue-700"
                        onClick={submitVote}
                        disabled={isLocked}
                      >
                        Vote
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default VotingPortal;
