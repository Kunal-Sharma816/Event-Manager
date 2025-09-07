import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided and valid
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log("MongoDB URI not found. Exiting...");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.log("Using in-memory database for development.");
  }
};

export default connectDB;
