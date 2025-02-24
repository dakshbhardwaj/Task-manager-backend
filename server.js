require("dotenv").config();
const express = require("express");
const cors = require("cors");
const net = require('net');
const connectDB = require("./config/db");

const app = express();
const BASE_PORT = process.env.PORT || 5000;

// Function to check if a port is available
const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer()
            .once('error', () => resolve(false))
            .once('listening', () => {
                server.close();
                resolve(true);
            })
            .listen(port);
    });
};

// Function to find available port
const findAvailablePort = async (startPort) => {
    let port = startPort;
    while (!(await isPortAvailable(port))) {
        port++;
    }
    return port;
};

app.use(express.json());
app.use(cors());

connectDB();

/**
 * Health Check API
 */
app.get("/health", (req, res) => {
    res.json({ status: "UP" });
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));

// Start server with dynamic port
findAvailablePort(BASE_PORT).then(port => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
    console.error('Failed to find available port:', err);
    process.exit(1);
});
