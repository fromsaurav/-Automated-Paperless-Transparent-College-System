import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Testing", // Ensure your database name is correctly set
    });
    console.log("✅ Connected to database!");
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};
