import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { connectToMongoDB } from "./mongo.js";
import { setMongoConnectionStatus } from "./storage-factory.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, "../dist/public")));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Handle all other routes by serving index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

(async () => {
  try {
    // Connect to MongoDB
    const mongoConnection = await connectToMongoDB();
    const isConnected = mongoConnection !== null;
    setMongoConnectionStatus(isConnected);
    log(`MongoDB connection status: ${isConnected ? 'Connected' : 'Failed'}`, 'server');
    
    // Register API routes
    await registerRoutes(app);
    
    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      log(`Server is running on port ${port}`, 'server');
    });
  } catch (error) {
    log(`Error in server setup: ${error}`, 'server');
    setMongoConnectionStatus(false);
  }
})();
