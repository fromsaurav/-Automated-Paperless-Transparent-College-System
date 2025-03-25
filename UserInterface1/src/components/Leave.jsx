import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000";

const LeaveApplication = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [proof, setProof] = useState(null);

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
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP");
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
        toast.success("OTP verified");
        setIsVerified(true);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP");
    }
  };

  const handleFileChange = (e) => setProof(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !reason || !startDate || !endDate || !proof) {
      toast.error("All fields are required!");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("reason", reason);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("proofDocument", proof);

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/apply`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Leave application submitted!");
        setName("");
        setEmail("");
        setReason("");
        setStartDate("");
        setEndDate("");
        setProof(null);
      } else {
        toast.error(data.message || "Failed to apply for leave.");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.error("Error submitting leave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="p-6 bg-gray-800 shadow-lg rounded-lg w-full max-w-lg">
        {!otpSent ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Email Verification</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : !isVerified ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Leave Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required />
              <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required />
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required />
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? "Submitting..." : "Apply for Leave"}</button>
            </form>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveApplication;
