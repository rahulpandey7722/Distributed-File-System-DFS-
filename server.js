const { initBuckets } = require("./config/nodes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const fileRoutes = require("./routes/files");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);
app.use("/api", fileRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("DFS Backend Running 🚀");
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Start server safely
const startServer = async () => {
  await connectDB();
  initBuckets(); 

  let PORT = 3001;

  const startListening = (port) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`❌ Port ${port} already in use. Trying ${port + 1}...`);
        startListening(port + 1); // try next port correctly
      } else {
        console.error("❌ Server Error:", err);
      }
    });
  };

  startListening(PORT);
};

// Start
startServer();