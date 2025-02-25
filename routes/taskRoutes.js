const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error fetching task" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user.id });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error creating task" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

module.exports = router;
