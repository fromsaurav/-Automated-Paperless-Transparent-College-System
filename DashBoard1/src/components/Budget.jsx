import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetDetails, setBudgetDetails] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amountAllocated: "",
    sponsor: "",
    createdBy: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/allbudget`)
      .then((res) => setBudgets(res.data.budgets))
      .catch((err) => console.error("Error fetching budgets:", err));
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/budget/${id}`)
        .then((res) => setBudgetDetails(res.data.budget))
        .catch((err) => console.error("Error fetching budget details:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/budgetadd`, formData);
      toast.success("Budget added successfully!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error("Failed to add budget!");
    }
  };

  const handleVerifyBudget = async () => {
    try {
      await axios.put(`${API_URL}/${id}/verify`);
      toast.success("Budget verified successfully!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error("Failed to verify budget.");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`${API_URL}/budget/${id}/status`, { status: newStatus });
      toast.success("Budget status updated successfully!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error("Failed to update budget status.");
    }
  };
  const handleTableStatusChange = async (budgetId, newStatus) => {
    try {
      await axios.put(`${API_URL}/${budgetId}/verify`, { status: newStatus });
  
      // Update the local state immediately
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget._id === budgetId ? { ...budget, status: newStatus } : budget
        )
      );
  
      toast.success("Budget status updated successfully!");
    } catch (error) {
      toast.error("Failed to update budget status.");
    }
  };
  

  return (
    <div className="p-6">
      <ToastContainer />
      {id && budgetDetails ? (
        <div>
          <h2 className="text-3xl font-bold">{budgetDetails.title}</h2>
          <p className="mt-2">Category: {budgetDetails.category}</p>
          <p>Amount Allocated: {budgetDetails.amountAllocated}</p>
          <p>Amount Spent: {budgetDetails.amountSpent}</p>
          <p>Sponsorship: {budgetDetails.sponsor || "N/A"}</p>
          <p>Status: {budgetDetails.status}</p>
          
          <select
            className="mt-4 border p-2 rounded"
            value={budgetDetails.status}
            onChange={handleStatusChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Verified">Verified</option>
          </select>
          
          {budgetDetails.status !== "Verified" && (
            <button
              onClick={handleVerifyBudget}
              className="ml-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Verify Budget
            </button>
          )}
          
          <button
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
            onClick={() => navigate("/budget")}
          >
            Back to Budgets
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Budget</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <input type="text" name="title" placeholder="Budget Title" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="text" name="category" placeholder="Category" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="number" name="amountAllocated" placeholder="Amount Allocated" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="text" name="sponsor" placeholder="Sponsor (optional)" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="text" name="createdBy" placeholder="Created By" className="w-full p-2 border rounded" onChange={handleChange} />
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Add Budget</button>
          </form>
          <h2 className="text-2xl font-semibold mt-8 mb-4">All Budgets</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg">
  <thead className="bg-gray-200">
    <tr>
      <th className="p-2">Title</th>
      <th className="p-2">Category</th>
      <th className="p-2">Amount Allocated</th>
      <th className="p-2">Sponsorship</th>
      <th className="p-2">Status</th>
    </tr>
  </thead>
  <tbody>
    {budgets.map((budget) => (
      <tr key={budget._id} className="border-t">
        <td
          className="p-2 text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate(`/budget/${budget._id}`)}
        >
          {budget.title}
        </td>
        <td className="p-2">{budget.category}</td>
        <td className="p-2">{budget.amountAllocated}</td>
        <td className="p-2">{budget.sponsor || "N/A"}</td>
        <td className="p-2">
          <select
            className="border p-1 rounded"
            value={budget.status}
            onChange={(e) => handleTableStatusChange(budget._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Verified">Verified</option>
          </select>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}
    </div>
  );
};

export default Budget;