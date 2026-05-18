import mongoose from "mongoose";
import { seedInitialProblems } from "../utils/seedProblems.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    // Auto-seed problems if collection is empty
    await seedInitialProblems();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;