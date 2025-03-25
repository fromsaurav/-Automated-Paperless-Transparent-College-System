import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { SickLeave } from "../models/sickSchema.js";
import { JobApplication } from "../models/jobApplicationSchema.js"; // Import JobApplication model

// 📌 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// 📌 Function to Send Emails
const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// 📌 Apply for Sick Leave
export const applySickLeave = catchAsyncErrors(async (req, res, next) => {
  const { name, email, reason, startDate, endDate, medicalProof } = req.body;

  if (!name || !email || !reason || !startDate || !endDate) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  let medicalProofUrl = null;

  // Upload base64 file to Cloudinary if provided
  if (medicalProof) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(medicalProof, {
        folder: "sick-leaves",
      });
      medicalProofUrl = uploadedResponse.secure_url;
    } catch (error) {
      return next(new ErrorHandler("File upload failed", 500));
    }
  }

  const sickLeave = new SickLeave({
    name,
    email,
    reason,
    startDate,
    endDate,
    medicalProof: medicalProofUrl,
  });

  await sickLeave.save();
  res.status(201).json({ success: true, message: "Sick leave application submitted!", sickLeave });
});

// 📌 Get All Sick Leave Applications
export const getAllSickLeaves = catchAsyncErrors(async (req, res) => {
  const sickLeaves = await SickLeave.find();
  res.status(200).json({ success: true, sickLeaves });
});

// 📌 Update Sick Leave Status with Email Notification
export const updateSickLeaveStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return next(new ErrorHandler("Invalid status update!", 400));
  }

  const sickLeave = await SickLeave.findByIdAndUpdate(id, { status }, { new: true });

  if (!sickLeave) {
    return next(new ErrorHandler("Sick leave application not found!", 404));
  }

  // 📌 Find the head's email from JobApplication based on the user's email
  const jobApplication = await JobApplication.findOne({ email: sickLeave.email });
  const heademail = jobApplication?.heademail; // Get head email from job application

  // Send Email to the User
  await sendEmail({
    to: sickLeave.email,
    subject: `Your Sick Leave Application has been ${status}`,
    text: `Hello ${sickLeave.name},\n\nYour sick leave application from ${new Date(sickLeave.startDate).toDateString()} to ${new Date(sickLeave.endDate).toDateString()} has been ${status.toLowerCase()}.\n\nThank you.`,
  });

  // Send Email to the Head (if found)
  if (heademail) {
    await sendEmail({
      to: heademail,
      subject: `Sick Leave Update for ${sickLeave.name}`,
      text: `Hello,\n\n${sickLeave.name} has applied for sick leave from ${new Date(sickLeave.startDate).toDateString()} to ${new Date(sickLeave.endDate).toDateString()}. The leave has been ${status.toLowerCase()}.\n\nThank you.`,
    });
  }

  res.status(200).json({ success: true, message: `Sick leave ${status.toLowerCase()} successfully!`, sickLeave });
});
