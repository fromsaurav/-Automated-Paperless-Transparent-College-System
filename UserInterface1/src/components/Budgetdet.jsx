import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000"; // Adjust as needed

const BudgetDetails = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    proof: null,
  });

  // 📌 Fetch Budget Details
  useEffect(() => {
    axios
      .get(`${API_URL}/budget/${id}`)
      .then((res) => setBudget(res.data.budget))
      .catch((err) => console.error("Error fetching budget:", err));
  }, [id]);

  // 📌 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  // 📌 Handle File Change (Proof)
  const handleFileChange = (e) => {
    setExpenseData({ ...expenseData, proof: e.target.files[0] });
  };

  // 📌 Handle Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseData.description || !expenseData.amount || !expenseData.proof) {
      toast.error("All fields and proof are required!");
      return;
    }

    const formData = new FormData();
    formData.append("description", expenseData.description);
    formData.append("amount", expenseData.amount);
    formData.append("proof", expenseData.proof);

    try {
      await axios.post(`${API_URL}/budget/${id}/addExpense`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Expense added successfully!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense!");
    }
  };

  // 📌 Verify Expense
  const handleVerifyExpense = async (expenseId) => {
    try {
      await axios.put(`${API_URL}/${id}/verifyExpense/${expenseId}`);
      toast.success("Expense verified successfully!");

      // Update budget data in UI
      setBudget((prevBudget) => ({
        ...prevBudget,
        expenses: prevBudget.expenses.map((exp) =>
          exp._id === expenseId ? { ...exp, status: "Verified" } : exp
        ),
      }));
    } catch (error) {
      console.error("Error verifying expense:", error);
      toast.error("Failed to verify expense.");
    }
  };

  if (!budget) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />

      {/* 📌 Budget Details */}
      <h2 className="text-3xl font-bold mb-4">{budget.title}</h2>
      <p className="mb-2"><strong>Category:</strong> {budget.category}</p>
      <p className="mb-2"><strong>Allocated:</strong> ₹{budget.amountAllocated}</p>
      <p className="mb-2"><strong>Spent:</strong> ₹{budget.amountSpent}</p>
      <p className="mb-4"><strong>Status:</strong> {budget.status}</p>

      {/* 📌 Expense Form */}
      <h3 className="text-xl font-semibold mt-6">Add Expense</h3>
      <form
        onSubmit={handleAddExpense}
        className="bg-white p-4 rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          name="description"
          placeholder="Expense Description"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Expense Amount"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="file"
          className="w-full p-2 border rounded"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Add Expense
        </button>
      </form>

      {/* 📌 Expenses Table */}
      <h3 className="text-xl font-semibold mt-6">Expenses</h3>
      {budget.expenses.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budget.expenses.map((exp) => (
              <tr key={exp._id} className="border-t">
                <td className="p-2">{exp.description}</td>
                <td className="p-2">₹{exp.amount}</td>
                <td className={`p-2 font-bold ${exp.status === "Verified" ? "text-green-600" : "text-red-600"}`}>
                  {exp.status}
                </td>
                <td className="p-2 flex space-x-2">
                  {/* 📌 View Proof Button */}
                  <button
                    onClick={() => setSelectedProof(exp.proofUrl)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    View Proof
                  </button>

                  {/* 📌 Verify Button (Only if not verified) */}
                  {exp.status !== "Verified" && (
                    <button
                      onClick={() => handleVerifyExpense(exp._id)}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No expenses added yet.</p>
      )}

      {/* 📌 Iframe to Show Proof */}
      {selectedProof && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Expense Proof</h3>
          <iframe
            src={selectedProof}
            title="Expense Proof"
            className="w-full h-96 border mt-2"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default BudgetDetails;
