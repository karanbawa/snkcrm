import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { connectToMongoDB } from "./mongo.js";
import { setMongoConnectionStatus } from "./storage-factory.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from dist/public
app.use(
  express.static(path.join(__dirname, "../dist/public"), {
    index: false,
    extensions: ["html", "js", "css", "png", "jpg", "jpeg", "gif", "svg"],
  })
);

// Custom logger for API responses
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJson: any = undefined;

  const originalJson = res.json.bind(res);
  res.json = (body, ...args) => {
    capturedJson = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) {
        logLine += ` :: ${JSON.stringify(capturedJson)}`;
      }
      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }
      log(logLine, "server");
    }
  });

  next();
});

// Register API routes
await registerRoutes(app);

// All remaining routes -> index.html (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err);
  log(`Error: ${err.message}`, "server");

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
});

// MongoDB connection + Server Start
async function initializeMongoDBAndStartServer() {
  try {
    const mongoConnection = await connectToMongoDB();
    const isConnected = mongoConnection !== null;
    setMongoConnectionStatus(isConnected);
    log(`MongoDB connection status: ${isConnected ? "Connected" : "Failed"}`, "server");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      log(`✅ Server is running on port ${port}`, "server");
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    log(`❌ Error in MongoDB setup: ${error}`, "server");
    setMongoConnectionStatus(false);
    process.exit(1); // Exit if DB connection fails
  }
}

// Start everything
initializeMongoDBAndStartServer();

export default app;
