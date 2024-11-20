const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Joi = require("joi");

// Joi schema for user registration
const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required()
});

const registerUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    // Check if email is already taken
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already in use" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(200).json({newUser, message: "User registered successfully" });

        // Optionally send confirmation email (using nodemailer)
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
      // Create token
      const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Set token in a secure cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      // Send token in response
      res.status(200).json({
        message: "Login successful",
        token, 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  

// Get user profile
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
};


const logoutUser = async (req, res) => {
    try {
      
      res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), 
      });
  
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging out" });
    }
  };
  
      
module.exports = { registerUser, loginUser, getUserProfile, logoutUser };
