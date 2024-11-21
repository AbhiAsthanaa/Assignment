

const Task = require("../models/task");

// Create a task
const createTask = async (req, res) => {
    const { title, description, dueDate, status, priority } = req.body;

    const newTask = new Task({
        title,
        description,
        dueDate,
        status,
        priority,
    });

    try {
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: "Error creating task" });
    }
};

// Get all tasks with optional filters and sorting
const getTasks = async (req, res) => {
    const { status, sortByDueDate, limit = 10, page = 1, search } = req.query;

    const filter = {}; 

    // Apply regex to the 'status' field if it exists
    if (status) {
        filter.status = { $regex: status, $options: "i" }; 
    }

    // Add regex filter for a "search" query parameter
    if (search) {
        filter.description = { $regex: search, $options: "i" }; 
    }

    const sortOptions = 
        sortByDueDate === "asc" ? { dueDate: 1 } 
        : sortByDueDate === "desc" ? { dueDate: -1 } 
        : {};

    const options = {
        limit: parseInt(limit, 10),
        skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
    };

    try {
        const tasks = await Task.find(filter)
            .sort(sortOptions)
            .limit(options.limit)
            .skip(options.skip);
        const totalTasks = await Task.countDocuments(filter);

        res.status(200).json({
            tasks,
            total: totalTasks,
            pages: Math.ceil(totalTasks / options.limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching tasks.", error: err.message });
    }
};


// Update task details
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, dueDate, priority } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        task.set({
            title: title || task.title,
            description: description || task.description,
            status: status || task.status,
            dueDate: dueDate || task.dueDate,
            priority: priority || task.priority,
        });

        await task.save();
        return res.status(200).json(task);
    } catch (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Error updating task. Please try again later." });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        await task.remove();
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (err) {
        console.error(`Error deleting task: ${err.message}`);
        res.status(500).json({ message: "Error deleting task. Please try again later." });
    }
};

// Assign task to a user (only admin or manager can assign tasks)
const assignTask = async (req, res) => {
    const { taskId, userId } = req.body;

    // Ensure only managers or admins can assign tasks
    if (!req.user.roles.includes("manager") && !req.user.roles.includes("admin")) {
        return res.status(403).json({ message: "Only managers or admins can assign tasks." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    try {
        task.assignedTo = userId;
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: "Error assigning task." });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, assignTask };
