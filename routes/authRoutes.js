const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendResetCode } = require("../utils/emailService");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ message: "User registered", token });
    } catch (error) {
        res.status(400).json({ error: "User already exists" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 3600000; 
        await user.save();

        await sendResetCode(user.email, resetCode);
        res.json({ message: "Reset code sent to email" });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: "Error in password reset process" });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        
        const user = await User.findOne({
            email,
            resetCode,
            resetCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset code" });
        }

        // Set new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: "Error resetting password" });
    }
});

module.exports = router;
