import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // user must provide name
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // email must be unique
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  subscription: [ // fixed typo
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ]
}, { timestamps: true }); // automatically adds createdAt and updatedAt

// Create the model
const user = mongoose.model("user", userSchema); // capitalize model name

export default user;
