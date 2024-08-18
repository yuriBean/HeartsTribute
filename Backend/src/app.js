// Import packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import router from "./services/idrive.services.js";

// Configure environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(compression());

// Allowed origins for CORS
const allowlist = ['https://app.heartstribute.com', 'https://www.app.heartstribute.com'];

// CORS configuration
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  const corsOptions = allowlist.includes(origin) ? { origin: true } : { origin: false };
  callback(null, corsOptions);
};

// Apply CORS with options delegate
app.use(cors(corsOptionsDelegate));

// API endpoints
app.use("/api", router);

// Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    result: "Not found",
  });
});

// Export app
export default app;
