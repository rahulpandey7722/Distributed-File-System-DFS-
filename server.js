const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initBuckets } = require("./config/nodes");

const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const fileRoutes = require("./routes/files");

const app = express();

// ✅ RATE LIMIT (only once, after app created)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50,
});
app.use(limiter);

// ✅ CORS
app.use(cors({
  origin: "https://distributed-file-system-dfs.vercel.app",
  methods: ["GET", "POST", "DELETE"],
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);
app.use("/api", fileRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("DFS Backend Running 🚀");
});

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// ✅ Start server
const startServer = async () => {
  await connectDB();
  initBuckets();

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();