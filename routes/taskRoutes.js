const express = require("express");
const { createTask, getTasks, updateTask, deleteTask, assignTask } = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Task CRUD routes
router.post("/tasks", authMiddleware, roleMiddleware(["admin", "manager"]), createTask);
router.get("/tasks", authMiddleware, getTasks);
router.put("/tasks/:taskId", authMiddleware, roleMiddleware(["admin", "manager"]), updateTask);
router.delete("/tasks/:taskId", authMiddleware, roleMiddleware(["admin", "manager"]), deleteTask);

// Task assignment route
router.post("/tasks/assign", authMiddleware, roleMiddleware(["admin", "manager"]), assignTask);

module.exports = router;
