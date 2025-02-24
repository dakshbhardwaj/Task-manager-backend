const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.json(task);
});

router.get("/", authMiddleware, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});

router.put("/:id", authMiddleware, async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

router.delete("/:id", authMiddleware, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

module.exports = router;
