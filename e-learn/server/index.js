// server/index.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./databases/db.js";
import userRoters from "./routes/user.js";

dotenv.config();

const app = express(); // ✅ define app before using it

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api", userRoters);

const port = process.env.PORT || 5000;

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// ✅ Start server + connect DB
app.listen(port, async () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  await connectDB();
});
