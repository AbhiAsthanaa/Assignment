const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    priority: {
        type: String,
        default: "normal",
        enum: ["high", "medium", "normal", "low"],
      }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
