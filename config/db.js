
const mongoose = require("mongoose");
require("dotenv").config();

let isConnected;

const dbConnect = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50, 
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connections[0].readyState;
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = dbConnect;
