import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import router from "./services/idrive.services.js";

dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json({ limit: "20mb" }));
app.use(compression());

// Allowed origins for CORS
const allowlist = ['https://app.heartstribute.com', 'https://www.app.heartstribute.com'];

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  console.log('Origin:', origin);  

  const corsOptions = allowlist.includes(origin) ? { origin: true } : { origin: false };
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({
    result: "Not found",
  });
});

export default app;
