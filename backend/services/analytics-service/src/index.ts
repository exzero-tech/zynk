import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Analytics Service!");
});

// Example API route
app.get("/api/status", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Analytics Service is running on http://localhost:${PORT}`);
});
