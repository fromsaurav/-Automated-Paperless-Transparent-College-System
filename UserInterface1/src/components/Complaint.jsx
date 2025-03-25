import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDgKKUPGNOSIKTDrYAxck_qmMqTlI2Zz7c"); // Replace with your key

export default function ComplaintForm() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    description: "",
    isAnonymous: false,
    media: null,
  });
  const [aiResponse, setAiResponse] = useState("");
  
  const API_URL = "http://localhost:4000";

  // Fetch Complaints
  useEffect(() => {
    axios.get(`${API_URL}/comall`)
      .then((res) => setComplaints(res.data.complaints))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
      reader.onloadend = () => {
        setForm({ ...form, media: reader.result }); // Store Base64 data
      };
    }
  };
  
  // **Analyze Complaint with Gemini AI**
  
    
  const analyzeMedia = async (imageBase64) => {
    const apiKey = "AIzaSyDgKKUPGNOSIKTDrYAxck_qmMqTlI2Zz7c"; // Replace with a valid API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  
    const requestBody = {
      contents: [
        {
          parts: [
            { text: "Analyze this image for explicit, violent, or inappropriate content. Reply only with 'YES' or 'NO'." },
            { inlineData: { mimeType: "image/jpeg/jpg/pdf", data: imageBase64.split(",")[1] } },
          ],
        },
      ],
    };
    
    
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
    
        const data = await response.json();
        console.log("Gemini API Response:", data);
    
        if (data.candidates && data.candidates.length > 0) {
          const aiResult = data.candidates[0].content.parts[0].text.trim().toUpperCase();
          
          if (aiResult === "YES") {
            alert("Your complaint contains inappropriate Content. Please modify it.");
            return false; // Prevent submission
          }
        }
      } catch (error) {
        console.error("Error with AI analysis:", error);
        alert("AI analysis failed.");
        return false;
      }
    
      return true; // Allow submission if content is clean
    };
    const analyzeComplaint = async (description) => {
      const apiKey = "AIzaSyDgKKUPGNOSIKTDrYAxck_qmMqTlI2Zz7c"; // Replace with a valid API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Check if the following complaint contains vulgar, offensive, or inappropriate language. Reply with only "YES" or "NO".\n\n"${description}"`,
              },
            ],
          },
        ],
      };
    
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
    
        const data = await response.json();
        console.log("Gemini API Response:", data);
    
        if (data.candidates && data.candidates.length > 0) {
          const aiResult = data.candidates[0].content.parts[0].text.trim().toUpperCase();
          
          if (aiResult === "YES") {
            alert("Your complaint contains inappropriate language. Please modify it.");
            return false; // Prevent submission
          }
        }
      } catch (error) {
        console.error("Error with AI analysis:", error);
        alert("AI analysis failed.");
        return false;
      }
    
      return true; // Allow submission if content is clean
    };
    
  
  
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // **Check for vulgar language in description**
    const isDescriptionValid = await analyzeComplaint(form.description);
    if (!isDescriptionValid) return; // Stop submission if vulgar
  
    // **Check for inappropriate content in media**
    if (form.media) {
      const isMediaValid = await analyzeMedia(form.media);
      if (!isMediaValid) return; // Stop submission if media is inappropriate
    }
  
    // Proceed with submission if checks pass
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
  
    try {
      await axios.post(`${API_URL}/crecom`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Complaint Submitted!");
      setForm({
        studentName: "",
        studentEmail: "",
        description: "",
        isAnonymous: false,
        media: null,
      });
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint!");
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-700">
      {/* Complaint Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 text-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Create Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <input
            type="text"
            name="studentName"
            placeholder="Your Name"
            className="w-full p-2 border rounded text-gray-700"
            value={form.studentName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="studentEmail"
            placeholder="Your Email"
            className="w-full p-2 border rounded text-gray-700"
            value={form.studentEmail}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Describe your complaint..."
            className="w-full p-2 border rounded text-gray-700"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input type="file" name="media" onChange={handleFileChange} className="w-full p-2 border rounded text-gray-700" />
          <label className="flex items-center">
            <input type="checkbox" name="isAnonymous" className="mr-2 text-gray-700" checked={form.isAnonymous} onChange={handleChange} />
            Submit as Anonymous
          </label>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-gray-700">
            Submit Complaint
          </button>
        </form>

        {/* Display AI Feedback */}
        {aiResponse && (
          <div className="mt-4 p-4 bg-gray-100 border rounded">
            <h3 className="text-md font-bold text-gray-700">AI Analysis:</h3>
            <p className="text-gray-700">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
