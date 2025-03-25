import { Candidate } from "../models/candidateSchema.js";
import { JobApplication } from "../models/jobApplicationSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// 📌 Upload File to Cloudinary
const uploadFile = async (file) => {
  const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "candidate_uploads",
    resource_type: "auto",
  });
  return uploadedFile.secure_url;
};

// 📌 Add a Candidate
export const addCandidate = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name) return next(new ErrorHandler("Candidate name is required!", 400));

  let profilePhotoUrl = null;
  let narrativePDFUrl = null;

  // 📌 Upload Profile Photo if provided
  if (req.files?.profilePhoto) {
    profilePhotoUrl = await uploadFile(req.files.profilePhoto);
  }

  // 📌 Upload Narrative PDF if provided
  if (req.files?.narrativePDF) {
    narrativePDFUrl = await uploadFile(req.files.narrativePDF);
  }

  // 📌 Create Candidate Entry
  const candidate = new Candidate({
    name,
    profilePhoto: profilePhotoUrl,
    narrativePDF: narrativePDFUrl,
  });

  await candidate.save();
  res.status(201).json({ success: true, message: "Candidate added successfully!", candidate });
});

// 📌 Remove a Candidate
export const removeCandidate = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const candidate = await Candidate.findByIdAndDelete(id);

  if (!candidate) return next(new ErrorHandler("Candidate not found!", 404));

  res.status(200).json({ success: true, message: "Candidate removed successfully!", candidate });
});

// 📌 Vote for a Candidate (Gender-based)
export const addVote = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { identifier } = req.body;

  if (!identifier) return next(new ErrorHandler("Identifier is required!", 400));

  // 📌 Find Student
  const student = await JobApplication.findOne({ $or: [{ reg: identifier }, { email: identifier }] });

  if (!student) return next(new ErrorHandler("Student not found!", 404));
  if (student.isVoted) return next(new ErrorHandler("You have already voted!", 400));

  // 📌 Find Candidate
  const candidate = await Candidate.findById(id);
  if (!candidate) return next(new ErrorHandler("Candidate not found!", 404));

  // 📌 Add Vote Based on Gender
  if (student.gender === "Male") {
    candidate.maleVotes += 1;
  } else if (student.gender === "Female") {
    candidate.femaleVotes += 1;
  } else {
    return next(new ErrorHandler("Invalid gender!", 400));
  }

  candidate.totalVotes = candidate.maleVotes + candidate.femaleVotes;
  await candidate.save();

  // 📌 Mark Student as Voted
  student.isVoted = true;
  await student.save();

  res.status(200).json({ success: true, message: "Vote cast successfully!", candidate });
});

// 📌 Get All Candidates
export const getAllCandidates = catchAsyncErrors(async (req, res) => {
  const candidates = await Candidate.find();
  res.status(200).json({ success: true, candidates });
});

// 📌 Check Voting Status
export const checkVoteStatus = catchAsyncErrors(async (req, res, next) => {
  const { identifier } = req.query;

  if (!identifier) return next(new ErrorHandler("Identifier is required!", 400));

  const student = await JobApplication.findOne({ $or: [{ reg: identifier }, { email: identifier }] });

  if (!student) return next(new ErrorHandler("Student not found!", 404));

  res.status(200).json({ success: true, hasVoted: student.isVoted });
});

// 📌 Update Voting Status
export const updateVotingStatus = catchAsyncErrors(async (req, res, next) => {
  const { identifier } = req.body;

  if (!identifier) return next(new ErrorHandler("Identifier is required!", 400));

  const student = await JobApplication.findOne({ $or: [{ reg: identifier }, { email: identifier }] });

  if (!student) return next(new ErrorHandler("Student not found!", 404));

  student.isVoted = true;
  await student.save();

  res.status(200).json({ success: true, message: "Voting status updated successfully!" });
});
