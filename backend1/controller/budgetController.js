import Budget from "../models/budgetSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// 📌 Upload Proof to Cloudinary
const uploadProof = async (file) => {
  const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "budget_proofs",
    resource_type: "auto",
  });
  return uploadedFile.secure_url;
};

// 📌 Add Budget with Initial Expenses
export const addBudget = catchAsyncErrors(async (req, res, next) => {
  const { title, category, amountAllocated, sponsor, createdBy, expenses } = req.body;

  if (!title || !category || !amountAllocated || !createdBy) {
    return next(new ErrorHandler("All required fields must be filled!", 400));
  }

  let expenseList = [];

  if (expenses && expenses.length > 0) {
    for (const expense of expenses) {
      if (!expense.description || !expense.amount || !expense.proof) {
        return next(new ErrorHandler("All expense fields and proof are required!", 400));
      }
      const proofUrl = await uploadProof(expense.proof);
      expenseList.push({ description: expense.description, amount: expense.amount, proofUrl });
    }
  }

  const budget = await Budget.create({
    title,
    category,
    amountAllocated,
    sponsor,
    createdBy,
    expenses: expenseList,
    amountSpent: expenseList.reduce((acc, exp) => acc + exp.amount, 0)
  });

  res.status(201).json({ success: true, message: "Budget created successfully!", budget });
});

// 📌 Edit Budget (Allows Adding New Expenses)
export const updateBudget = catchAsyncErrors(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) return next(new ErrorHandler("Budget not found", 404));

  const { title, category, amountAllocated, sponsor } = req.body;
  if (title) budget.title = title;
  if (category) budget.category = category;
  if (amountAllocated) budget.amountAllocated = amountAllocated;
  if (sponsor) budget.sponsor = sponsor;

  await budget.save();
  res.status(200).json({ success: true, message: "Budget updated successfully!", budget });
});

// 📌 Add Expense Later to Existing Budget
export const addExpense = catchAsyncErrors(async (req, res, next) => {
    try {
      const { description, amount } = req.body;
      const budget = await Budget.findById(req.params.id);
  
      // 📌 Check if Budget Exists
      if (!budget) {
        return next(new ErrorHandler("Budget not found", 404));
      }
  
      // 📌 Validate Input Fields
      if (!description || !amount) {
        return next(new ErrorHandler("Description and amount are required!", 400));
      }
  
      // 📌 Validate File Upload
      if (!req.files || !req.files.proof) {
        return next(new ErrorHandler("Proof file is required!", 400));
      }
  
      // 📌 Upload the Proof File to Cloudinary (Only One)
      const proofUrl = await uploadProof(req.files.proof);
  
      // 📌 Add Expense to Budget
      const newExpense = {
        description,
        amount: Number(amount),
        proofUrl, // Stores only one proof URL
      };
  
      budget.expenses.push(newExpense);
      budget.amountSpent += newExpense.amount;
      await budget.save();
  
      res.status(200).json({
        success: true,
        message: "Expense added successfully!",
        budget,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to add expense. Please try again.", 500));
    }
  });
  

// 📌 Get All Budgets
export const getBudgets = catchAsyncErrors(async (req, res) => {
  const budgets = await Budget.find();
  res.status(200).json({ success: true, budgets });
});

// 📌 Get a Single Budget by ID
export const getBudgetById = catchAsyncErrors(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) return next(new ErrorHandler("Budget not found", 404));

  res.status(200).json({ success: true, budget });
});

// 📌 Verify an Expense
export const verifyExpense = catchAsyncErrors(async (req, res, next) => {
  const budget = await Budget.findById(req.params.budgetId);
  if (!budget) return next(new ErrorHandler("Budget not found", 404));

  const expense = budget.expenses.id(req.params.expenseId);
  if (!expense) return next(new ErrorHandler("Expense not found", 404));

  expense.status = "Verified";
  await budget.save();

  res.status(200).json({ success: true, message: "Expense verified!", budget });
});

// 📌 Verify Entire Budget
export const verifyBudget = catchAsyncErrors(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) return next(new ErrorHandler("Budget not found", 404));

  budget.status = "Verified";
  await budget.save();

  res.status(200).json({ success: true, message: "Budget verified!", budget });
});

// 📌 Delete a Budget
export const deleteBudget = catchAsyncErrors(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) return next(new ErrorHandler("Budget not found", 404));

  await budget.deleteOne();
  res.status(200).json({ success: true, message: "Budget deleted successfully!" });
});
