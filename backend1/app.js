import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import jobApplicationRouter from "./router/jobApplicationRouter.js";
import companyRoutes from "./router/companyRoutes.js";
import testRouter from "./router/testRouter.js";
import {sendOtp,verifyOtp} from "./controller/otpController.js";
import { sendBulkEmails, sendCorrectionEmail } from "./controller/eController.js";
import { addCandidate, removeCandidate, addVote , getAllCandidates, checkVoteStatus, updateVotingStatus} from "./controller/candidatecontroller.js"
import { addFacility, bookFacility, getAllBookingRequests, getAllFacilities, getFacilityBookings, requestBooking, updateBookingStatus } from "./controller/facilityController.js";
import { deleteApplication, getAllApplications, getApplicationById, postApplication, updateApplication } from "./controller/applictionController.js";
import { createComplaint, getComplaints, updateComplaintStatus, voteComplaint } from "./controller/complaintController.js";
import Error from "./middlewares/err.js";
import { addCheater, getCheaters } from "./controller/cheaterController.js";
import { addBudget, addExpense, deleteBudget, getBudgetById, getBudgets, updateBudget, verifyBudget, verifyExpense } from "./controller/budgetController.js";
import { addLeave, getAllLeaves, updateLeaveStatus } from "./controller/leaveController.js";
import { applySickLeave, getAllSickLeaves, updateSickLeaveStatus } from "./controller/sickLeaveController.js";
import nodemailer from "nodemailer";

const app = express();
config({ path: ".env" });

app.use(
  cors({
    origin: true,  // Allow all origins
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.post("/api/v1/sendOtp", sendOtp);
app.post("/api/v1/verifyOtp", verifyOtp);
app.post("/api/v1/sendCorrectionEmail", sendCorrectionEmail);
app.post("/api/v1/sendEmail", sendBulkEmails);

app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobApplication", jobApplicationRouter);
app.use("/api/v1/test", testRouter);

app.post("/candidate", addCandidate);

// Remove Candidate
app.delete("/candidate/:id", removeCandidate);

// Vote for Candidate (with gender-based voting)
app.put("/candidate/vote/:id", addVote);

// Get All Candidates
app.get("/candidates", getAllCandidates);

// Check if Student Has Voted
app.get("/vote-status", checkVoteStatus);

// Update Voting Status (for testing/admin use)
app.put("/update-vote-status", updateVotingStatus);



app.post("/addfacilities", addFacility); // Add a facility
app.get("/getfacilities", getAllFacilities); // Get all facilities
app.post("/requestBooking", requestBooking);
app.get("/bookings", getAllBookingRequests); 
app.put("/update-booking-status", updateBookingStatus);


// 📌 Submit a New Application
app.post("/submit1", postApplication);

// 📌 Modify an Existing Application
app.put("/edit/:id", updateApplication);

// 📌 Remove an Application
app.delete("/remove/:id", deleteApplication);

// 📌 Retrieve All Applications
app.get("/list", getAllApplications);

// 📌 Retrieve a Single Application by ID
app.get("/view/:id", getApplicationById);

app.post("/crecom", createComplaint);
app.get("/comall", getComplaints);
app.post("/votcom/:id", voteComplaint);
app.put("/comstatus/:id", updateComplaintStatus);

app.post("/addChe", addCheater);
app.get("/allChe", getCheaters);

app.post("/budgetadd", addBudget); // Add a new budget with expenses
app.put("/editbudget/:id", updateBudget); // Edit budget details
app.get("/allbudget", getBudgets); // Get all budgets
app.get("/budget/:id", getBudgetById); // Get a budget by ID
app.post("/budget/:id/addExpense", addExpense);

app.put("/:budgetId/verifyExpense/:expenseId", verifyExpense); // Verify a single expense
app.put("/:id/verify", verifyBudget); // Verify entire budget
app.delete("budget/:id", deleteBudget); // Delete a budget


app.post("/apply", addLeave); // Apply for leave
app.get("/all", getAllLeaves); // Get all leave applications
app.put("/status/:id", updateLeaveStatus); // Approve/Reject leave
// Route to apply for sick leave
app.post("/sickapply", applySickLeave);

// Route to get all sick leave applications
app.get("/sickall", getAllSickLeaves);

// Route to update sick leave status
app.put("/sickupdate/:id", updateSickLeaveStatus);
app.post("/send-doctor-message", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Email and message are required" });
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
      pass: process.env.PASSWORD, 
      },
    });

    // Email content
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Doctor's Note for Your Sick Leave",
      text: `Dear Student,\n\nYour doctor's note:\n\n"${message}"\n\nBest Regards,\nAdmin`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Doctor's note sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, error: "Failed to send doctor's note" });
  }
});



app.use(cookieParser());




dbConnection();
app.use(Error);
app.use(errorMiddleware);

export default app;
