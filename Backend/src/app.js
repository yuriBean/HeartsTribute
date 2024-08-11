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
app.use(cors());
app.use(compression());
dotenv.config();


// api endpoints
app.use("/api", router);

// fallback
app.use((req, res) => {
  res.status(404).json({
    result: "Not found",
  });
});

export default app;