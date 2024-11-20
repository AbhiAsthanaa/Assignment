// const Task = require("../models/task");

// // Create a task
// const createTask = async (req, res) => {
//     const { title, description, assignedTo, dueDate, status } = req.body;

//     // Ensure that only admins or managers can assign tasks to users
//     if (assignedTo && !req.user.roles.includes("manager") && !req.user.roles.includes("admin")) {
//         return res.status(403).json({ message: "Only managers or admins can assign tasks to users." });
//     }

//     const newTask = new Task({ title, description, assignedTo, dueDate, status });

//     try {
//         await newTask.save();
//         res.status(201).json(newTask);
//     } catch (err) {
//         res.status(500).json({ message: "Error creating task" });
//     }
// };

// // Get all tasks for the authenticated user with optional filters and sorting
// const getTasks = async (req, res) => {
//     const { status, sortByDueDate, assignedTo, limit = 10, page = 1 } = req.query;

//     const filter = { assignedTo: req.user.id };
//     if (status) filter.status = status;
//     if (assignedTo) filter.assignedTo = assignedTo;

//     const sortOptions = sortByDueDate === "asc" ? { dueDate: 1 } : sortByDueDate === "desc" ? { dueDate: -1 } : {};

//     const options = {
//         limit: parseInt(limit, 10),
//         skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
//     };

//     try {
//         const tasks = await Task.find(filter).sort(sortOptions).limit(options.limit).skip(options.skip);
//         const totalTasks = await Task.countDocuments(filter);

//         res.status(200).json({
//             tasks,
//             total: totalTasks,
//             pages: Math.ceil(totalTasks / options.limit),
//             currentPage: page,
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching tasks.", error: err.message });
//     }
// };




// // Update task details
// const updateTask = async (req, res) => {
//     const { taskId } = req.params;
//     const { title, description, status, assignedTo, dueDate } = req.body;

//     try {
//         // Fetch the task to update
//         const task = await Task.findById(taskId);
//         if (!task) {
//             return res.status(404).json({ message: "Task not found." });
//         }

//         // Check if the user is allowed to update the task (either the task owner, admin, or manager)
//         const userHasPermission = task.assignedTo.toString() === req.user.id || 
//                                   req.user.roles.some(role => ['admin', 'manager'].includes(role));
//         if (!userHasPermission) {
//             return res.status(403).json({ message: "You do not have permission to update this task." });
//         }

//         // Update task details
//         task.set({
//             title: title || task.title,
//             description: description || task.description,
//             status: status || task.status,
//             assignedTo: assignedTo || task.assignedTo,
//             dueDate: dueDate || task.dueDate,
//         });

//         // Save the task with updated details
//         await task.save();

//         // Respond with the updated task
//         return res.status(200).json(task);
//     } catch (err) {
//         // Provide a more descriptive error message
//         console.error("Error updating task:", err);
//         return res.status(500).json({ message: "Error updating task. Please try again later." });
//     }
// };




// // Delete a task
// const deleteTask = async (req, res) => {
//     const { taskId } = req.params;

//     // Only allow task deletion if the user is either an admin, manager, or the task owner
//     try {
//         const task = await Task.findById(taskId);
        
//         // Check if the task exists
//         if (!task) {
//             return res.status(404).json({ message: "Task not found." });
//         }

//         // Check if the user has permission (either the task owner, admin, or manager)
//         if (task.assignedTo.toString() !== req.user.id && !req.user.roles.includes("admin") && !req.user.roles.includes("manager")) {
//             return res.status(403).json({ message: "You do not have permission to delete this task." });
//         }

//         // Remove the task
//         await task.remove();
//         res.status(200).json({ message: "Task deleted successfully." });

//     } catch (err) {
//         console.error(`Error deleting task: ${err.message}`); // Log the error for debugging
//         res.status(500).json({ message: "Error deleting task. Please try again later." });
//     }
// };




// // Assign task to a user (can be done only by manager or admin)
// const assignTask = async (req, res) => {
//     const { taskId, userId } = req.body;

//     // Ensure only managers or admins can assign tasks
//     if (!req.user.roles.includes("manager") && !req.user.roles.includes("admin")) {
//         return res.status(403).json({ message: "Only managers or admins can assign tasks." });
//     }

//     const task = await Task.findById(taskId);
//     if (!task) {
//         return res.status(404).json({ message: "Task not found." });
//     }

//     try {
//         task.assignedTo = userId;
//         await task.save();
//         res.status(200).json(task);
//     } catch (err) {
//         res.status(500).json({ message: "Error assigning task." });
//     }
// };

// module.exports = { createTask, getTasks, updateTask, deleteTask, assignTask };



















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
    const { status, sortByDueDate, limit = 10, page = 1 } = req.query;

    const filter = {}; // No need for assignedTo anymore
    if (status) filter.status = status;

    const sortOptions = sortByDueDate === "asc" ? { dueDate: 1 } : sortByDueDate === "desc" ? { dueDate: -1 } : {};

    const options = {
        limit: parseInt(limit, 10),
        skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
    };

    try {
        const tasks = await Task.find(filter).sort(sortOptions).limit(options.limit).skip(options.skip);
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
