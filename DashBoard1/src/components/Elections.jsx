import React, { useState, useEffect, useRef } from "react";

const Elections = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    profilePhoto: null,
    narrativePDF: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(""); // To track if it's an image or PDF
  const modalRef = useRef();
  const yy = "http://localhost:4000"; // Backend URL

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${yy}/candidates`);
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.name.trim()) {
      alert("Candidate name is required!");
      return;
    }

    const securityKey = prompt("Enter the security key:");
    if (securityKey !== "DEANS123") {
      alert("Invalid security key. Cannot add candidate.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", newCandidate.name);
      if (newCandidate.profilePhoto) formData.append("profilePhoto", newCandidate.profilePhoto);
      if (newCandidate.narrativePDF) formData.append("narrativePDF", newCandidate.narrativePDF);

      const response = await fetch(`${yy}/candidate`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setCandidates([...candidates, data.candidate]);
        setNewCandidate({ name: "", profilePhoto: null, narrativePDF: null });
      } else {
        alert("Error adding candidate: " + data.message);
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCandidate = async (id) => {
    try {
      setLoading(true);
      await fetch(`${yy}/candidate/${id}`, {
        method: "DELETE",
      });
      setCandidates(candidates.filter((candidate) => candidate._id !== id));
    } catch (error) {
      console.error("Error removing candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const openFileViewer = (fileUrl, type) => {
    setSelectedFile(fileUrl);
    setFileType(type);
    modalRef.current.showModal();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🗳️ College Elections</h1>

      {/* Add Candidate Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>
        <input
          type="text"
          value={newCandidate.name}
          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          placeholder="Enter candidate name"
          className="border rounded-lg p-2 w-full mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCandidate({ ...newCandidate, profilePhoto: e.target.files[0] })}
          className="border rounded-lg p-2 w-full mb-2"
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setNewCandidate({ ...newCandidate, narrativePDF: e.target.files[0] })}
          className="border rounded-lg p-2 w-full mb-2"
        />
        <button
          onClick={handleAddCandidate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Candidate"}
        </button>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <div className="relative">
              {candidate.profilePhoto ? (
                <>
                  <img
                    src={candidate.profilePhoto}
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button
                    onClick={() => openFileViewer(candidate.profilePhoto, "image")}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    View Image
                  </button>
                </>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold mt-4">{candidate.name}</h3>
            <div className="mt-2 text-gray-700">
              <p>🧑‍💼 Male Votes: {candidate.maleVotes}</p>
              <p>👩 Female Votes: {candidate.femaleVotes}</p>
              <p className="font-semibold">🗳️ Total Votes: {candidate.totalVotes}</p>
            </div>
            {candidate.narrativePDF && (
              <button
                onClick={() => openFileViewer(candidate.narrativePDF, "pdf")}
                className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                View Narrative
              </button>
            )}
            <button
              onClick={() => handleRemoveCandidate(candidate._id)}
              disabled={loading}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* File Viewer Modal */}
      <dialog ref={modalRef} className="p-4 rounded-lg bg-white shadow-lg max-w-2xl mx-auto">
        <button
          onClick={() => modalRef.current.close()}
          className="absolute top-2 right-2 bg-gray-300 px-3 py-1 rounded-full"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">Candidate Document</h2>
        {selectedFile && (
          fileType === "image" ? (
            <img src={selectedFile} alt="Candidate" className="w-full rounded-lg" />
          ) : (
            <iframe src={selectedFile} className="w-full h-96 border rounded-lg"></iframe>
          )
        )}
      </dialog>
    </div>
  );
};

export default Elections;
