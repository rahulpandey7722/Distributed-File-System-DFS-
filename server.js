require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { initNodes } = require('./config/nodes');

const uploadRoute = require('./routes/upload');
const downloadRoute = require('./routes/download');
const fileRoutes = require('./routes/files');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', uploadRoute);
app.use('/api', downloadRoute);
app.use('/api', fileRoutes);

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected");

  await initNodes();

  app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
  });
}

start();