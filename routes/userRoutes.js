const express = require("express");
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, getUserProfile, logoutUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Set up rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false, 
});


router.post("/login", loginLimiter, loginUser);

router.post("/register", registerUser);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
