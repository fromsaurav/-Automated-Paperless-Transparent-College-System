import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profilePhoto: { type: String }, // Cloudinary URL
    narrativePDF: { type: String }, // Cloudinary URL
    maleVotes: { type: Number, default: 0, min: 0 },
    femaleVotes: { type: Number, default: 0, min: 0 },
    totalVotes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
