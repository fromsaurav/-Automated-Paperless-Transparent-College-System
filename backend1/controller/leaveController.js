import { Leave } from "../models/leaveSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  

// 📌 Upload File to Cloudinary
const uploadFile = async (file) => {
  const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "leave_proofs",
    resource_type: "auto",
  });
  return uploadedFile.secure_url;
};

// 📌 Apply for Leave
export const addLeave = catchAsyncErrors(async (req, res, next) => {
  const { name, email, reason, startDate, endDate } = req.body;

  if (!name || !email || !reason || !startDate || !endDate) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  let proofDocumentUrl = null;

  // 📌 Upload Proof Document if provided
  if (req.files?.proofDocument) {
    proofDocumentUrl = await uploadFile(req.files.proofDocument);
  }

  const leave = new Leave({
    name,
    email,
    reason,
    startDate,
    endDate,
    proofDocument: proofDocumentUrl,
  });

  await leave.save();
  res.status(201).json({ success: true, message: "Leave application submitted!", leave });
});

// 📌 Get All Leaves
export const getAllLeaves = catchAsyncErrors(async (req, res) => {
  const leaves = await Leave.find();
  res.status(200).json({ success: true, leaves });
});

// 📌 Update Leave Status
export const updateLeaveStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!["Approved", "Rejected"].includes(status)) {
      return next(new ErrorHandler("Invalid status update!", 400));
    }
  
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
  
    if (!leave) {
      return next(new ErrorHandler("Leave application not found!", 404));
    }
  
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: leave.email,
      subject: "Leave Application Status Update",
      text: `Dear ${leave.name},\n\nYour leave application has been ${status.toLowerCase()}.\n\nReason: ${leave.reason}\nStart Date: ${leave.startDate}\nEnd Date: ${leave.endDate}\n\nBest Regards,\nAdministration Team`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  
    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully!`,
      leave,
    });
  });
