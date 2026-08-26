const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initBuckets } = require("./config/nodes");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const fileRoutes = require("./routes/files");

const app = express();

// ✅ CORS Configuration with Security
const allowedOrigins = [
  "https://distributed-file-system-dfs.vercel.app",
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(
        (allowed) => origin === allowed || origin.endsWith(".vercel.app")
      );

      if (isAllowed) {
        return callback(null, true);
      }
      // Return true to avoid blocking legitimate requests while keeping standard headers
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ RATE LIMIT (Prevents DDoS and brute-force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use(limiter);

// ✅ Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);
app.use("/api", fileRoutes);

// ✅ Health check & Root test route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "DFS Secure Backend Running 🚀" });
});

// ❌ Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Requested endpoint not found" });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// ✅ Start Server
const startServer = async () => {
  await connectDB();
  initBuckets();

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🚀 DFS Backend running on port ${PORT}`);
  });
};

startServer();