const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        enum: ["admin", "manager", "user"],
        default: ["user"]
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
