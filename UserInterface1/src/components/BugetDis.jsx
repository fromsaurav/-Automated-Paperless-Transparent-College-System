import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000";

const BudgetDis = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/allbudget`)
      .then((res) => setBudgets(res.data.budgets))
      .catch((err) => console.error("Error fetching budgets:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">📊 Budget Overview</h2>

      {/* Budget Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 shadow-lg rounded-xl border border-gray-700">
          <thead className="bg-gray-700 text-gray-300">
            <tr className="text-left">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Amount Allocated</th>
              <th className="p-4">Sponsorship</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <tr key={budget._id} className="border-t border-gray-700 hover:bg-gray-700 transition duration-200">
                  <td
                    className="p-4 text-blue-400 cursor-pointer hover:text-blue-300 font-medium"
                    onClick={() => setSelectedBudget(budget)}
                  >
                    {budget.title}
                  </td>
                  <td className="p-4 text-gray-300">{budget.category}</td>
                  <td className="p-4 text-gray-200 font-semibold">₹{budget.amountAllocated}</td>
                  <td className="p-4 text-gray-300">{budget.sponsor || "N/A"}</td>
                  <td
                    className={`p-4 font-semibold ${
                      budget.status === "Verified" ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {budget.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  No budget data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Budget Details Modal */}
      {selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center transition-all duration-300">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-xl w-full text-white border border-gray-600">
            <h2 className="text-3xl font-bold text-blue-400">{selectedBudget.title}</h2>
            <p className="mt-2"><strong>Category:</strong> {selectedBudget.category}</p>
            <p><strong>Amount Allocated:</strong> ₹{selectedBudget.amountAllocated}</p>
            <p><strong>Amount Spent:</strong> ₹{selectedBudget.amountSpent}</p>
            <p><strong>Sponsorship:</strong> {selectedBudget.sponsor || "N/A"}</p>
            <p><strong>Status:</strong> {selectedBudget.status}</p>

            {/* Expenses Table */}
            <h3 className="text-xl font-semibold mt-6 text-blue-300">💰 Expenses</h3>
            {selectedBudget.expenses.length > 0 ? (
              <table className="w-full bg-gray-800 shadow-md rounded-xl mt-4 border border-gray-700">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBudget.expenses.map((exp) => (
                    <tr key={exp._id} className="border-t border-gray-700 hover:bg-gray-700">
                      <td className="p-3">{exp.description}</td>
                      <td className="p-3 text-gray-200 font-medium">₹{exp.amount}</td>
                      <td
                        className={`p-3 font-bold ${
                          exp.status === "Verified" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {exp.status}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedProof(exp.proofUrl)}
                          className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-500"
                        >
                          View Proof
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-4 text-gray-300">No expenses added yet.</p>
            )}

            {/* Close Button */}
            <button
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              onClick={() => setSelectedBudget(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full border border-gray-600">
            <h3 className="text-xl font-semibold text-blue-300">🧾 Expense Proof</h3>
            <iframe
              src={selectedProof}
              title="Expense Proof"
              className="w-full h-96 border mt-2 rounded-lg"
            ></iframe>
            <button
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              onClick={() => setSelectedProof(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDis;
