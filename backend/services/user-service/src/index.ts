import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "user-service",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler:", error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred"
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
