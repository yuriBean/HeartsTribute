// packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import router from "./services/idrive.services.js";
// routers


//config + variables
const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(compression());
dotenv.config();

const allowedOrigins = ['https://app.heartstribute.com', 'https://www.app.heartstribute.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// api endpoints
app.use("/api", router);

// fallback
app.use((req, res) => {
  res.status(404).json({
    result: "Not found",
  });
});

export default app;