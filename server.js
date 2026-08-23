const { initBuckets } = require("./config/nodes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const fileRoutes = require("./routes/files");

const app = express();

// ✅ FIX CORS (IMPORTANT)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
}));

app.use(express.json());

// Routes
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);
app.use("/api", fileRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("DFS Backend Running 🚀");
});

// MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// ✅ IMPORTANT FIX FOR RENDER PORT
const startServer = async () => {
  await connectDB();
  initBuckets();

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();