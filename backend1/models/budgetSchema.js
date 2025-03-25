import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  proofUrl: { type: String, required: true },
  status: { type: String, enum: ["Unverified", "Verified"], default: "Unverified" }
});

const BudgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  amountAllocated: { type: Number, required: true },
  amountSpent: { type: Number, default: 0 },
  sponsor: { type: String },
  createdBy: { type: String, required: true },
  expenses: [ExpenseSchema], // Expenses added during or after budget creation
  status: { type: String, enum: ["Rejected", "Verified","Pending"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Budget", BudgetSchema);
