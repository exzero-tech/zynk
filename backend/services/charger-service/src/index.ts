import express, { type Request, type Response } from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { initializeOCPPServer, closeOCPPServer } from "./ocpp/ocpp.server.js";
import chargerRoutes from "./routes/charger.routes.js";
import ocppRoutes from "./routes/ocpp.routes.js";

dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3002;


// Middleware
app.use(express.json());

// API routes
app.use('/api/v1/chargers', chargerRoutes);
app.use('/api/v1/ocpp', ocppRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'charger-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Charger Service!");
});

try {
  initializeOCPPServer(server);
  console.log('OCPP server initialized');
} catch (error) {
  console.error('OCPP server initialization failed:', error);
  process.exit(1);
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  closeOCPPServer();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  closeOCPPServer();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Charger Service running on http://localhost:${PORT}`);
  console.log(`OCPP WebSocket server available at ws://localhost:${PORT}/ocpp`);
});
