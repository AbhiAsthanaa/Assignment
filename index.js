const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); 
const dbConnect = require("./config/db"); 
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
dotenv.config(); 

// Initialize Express app
const app = express();
app.use(cookieParser());

app.use(morgan("dev"));

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use(notFound);
app.use(errorHandler);
// Connect to the Database before starting the server
dbConnect()
  .then(() => {
    // Start the server once the DB is connected
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    // If database connection fails, log and exit the application
    console.error("Database connection failed:", error);
    process.exit(1); // Exit with failure
  });

// Error handling middleware - catch-all for any errors
app.use((err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // Respond with an error message
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err, 
  });
});

