import { useState } from "react";

export default function SickLeaveForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    startDate: "",
    endDate: "",
    medicalProof: null,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Upload (Convert to Base64)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, medicalProof: reader.result });
      };
    }
  };

  // Send OTP
  const sendOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/v1/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email!");
      } else {
        setMessage(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("Error sending OTP.");
    }
    setLoading(false);
  };

  // Verify OTP
  const verifyOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/v1/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setMessage("OTP verified! You can now submit your application.");
      } else {
        setMessage(data.message || "Invalid OTP.");
      }
    } catch (error) {
      setMessage("Error verifying OTP.");
    }
    setLoading(false);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setMessage("Please verify OTP before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/sickapply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Sick leave application submitted successfully!");
        setFormData({ name: "", email: "", reason: "", startDate: "", endDate: "", medicalProof: null });
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Error submitting the application.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sick Leave Application</h2>
        {message && <p className="text-green-400 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 bg-gray-700 rounded"
              required
              disabled={otpSent}
            />
            <button
              type="button"
              onClick={sendOTP}
              disabled={otpSent}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </button>
          </div>

          {otpSent && !otpVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
              <button
                type="button"
                onClick={verifyOTP}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
              >
                Verify OTP
              </button>
            </div>
          )}

          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason for Leave"
            className="w-full p-2 bg-gray-700 rounded"
            required
          ></textarea>

          <div className="flex gap-4">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-1/2 p-2 bg-gray-700 rounded"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-1/2 p-2 bg-gray-700 rounded"
              required
            />
          </div>

          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-700 rounded"
          />

          <button
            type="submit"
            disabled={!otpVerified || loading}
            className={`w-full p-2 rounded transition ${
              otpVerified ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
            } text-white`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
