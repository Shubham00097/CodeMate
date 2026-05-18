import mongoose from "mongoose";

const boilerplateSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isSample: {
    type: Boolean,
    default: false,
  },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    constraints: [
      {
        type: String,
      },
    ],
    boilerplate: [boilerplateSchema],
    testCases: [testCaseSchema],
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
