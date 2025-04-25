import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage-factory.js";
import { z } from "zod";
import { log } from "./vite.js";
import { v4 as uuidv4 } from "uuid";

// Define Zod schemas for validation
const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  notes: z.string(),
  status: z.enum(["active", "inactive"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const noteSchema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
  text: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const emailLogSchema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
  subject: z.string(),
  content: z.string(),
  sentAt: z.string().optional(),
});

const activityLogSchema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
  type: z.enum(["note_added", "email_sent", "status_changed"]),
  description: z.string(),
  createdAt: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get the appropriate storage implementation (MongoDB or in-memory)
  const storage = getStorage();
  
  // Customer routes
  app.get("/api/customers", async (req: Request, res: Response) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      log(`Error getting customers: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get customers" });
    }
  });
  
  app.get("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await storage.getCustomer(id);
      
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      log(`Error getting customer: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get customer" });
    }
  });
  
  app.post("/api/customers", async (req: Request, res: Response) => {
    try {
      const validatedData = customerSchema.parse(req.body);
      const newCustomer = await storage.createCustomer(validatedData);
      res.status(201).json(newCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      log(`Error creating customer: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to create customer" });
    }
  });
  
  app.put("/api/customers/:customerId", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const customerData = customerSchema.parse(req.body);
      const updatedCustomer = await storage.updateCustomer(customerId, customerData);
      res.json(updatedCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      log(`Error updating customer: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to update customer" });
    }
  });
  
  app.delete("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCustomer(id);
      
      if (!success) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      log(`Error deleting customer: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });
  
  app.post("/api/customers/:id/toggle-hot-lead", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedCustomer = await storage.toggleHotLead(id);
      
      if (!updatedCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(updatedCustomer);
    } catch (error) {
      log(`Error toggling hot lead: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to toggle hot lead" });
    }
  });
  
  app.post("/api/customers/:id/toggle-pinned", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedCustomer = await storage.togglePinned(id);
      
      if (!updatedCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(updatedCustomer);
    } catch (error) {
      log(`Error toggling pinned: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to toggle pinned" });
    }
  });
  
  app.get("/api/customers/upcoming-follow-ups/:days", async (req: Request, res: Response) => {
    try {
      const { days } = req.params;
      const customers = await storage.getCustomersWithUpcomingFollowUps(parseInt(days));
      res.json(customers);
    } catch (error) {
      log(`Error getting customers with upcoming follow-ups: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get customers with upcoming follow-ups" });
    }
  });
  
  app.get("/api/customers/needing-attention", async (req: Request, res: Response) => {
    try {
      const customers = await storage.getCustomersNeedingAttention();
      res.json(customers);
    } catch (error) {
      log(`Error getting customers needing attention: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get customers needing attention" });
    }
  });
  
  // Note routes
  app.get("/api/customers/:customerId/notes", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const notes = await storage.getNotesForCustomer(customerId);
      res.json(notes);
    } catch (error) {
      log(`Error getting notes: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get notes" });
    }
  });
  
  app.post("/api/customers/:customerId/notes", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      
      // Generate a new UUID for the note
      const noteId = uuidv4();
      
      // Validate request body
      const noteData = noteSchema.parse({
        ...req.body,
        customerId,
        id: noteId,
        timestamp: new Date()
      });
      
      const newNote = await storage.createNote(noteData);
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      log(`Error creating note: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to create note" });
    }
  });
  
  app.get("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const note = await storage.getNoteById(id);
      
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      log(`Error getting note: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get note" });
    }
  });
  
  app.put("/api/customers/:customerId/notes/:noteId", async (req: Request, res: Response) => {
    try {
      const { customerId, noteId } = req.params;
      const noteData = noteSchema.parse({
        ...req.body,
        customerId,
        id: noteId
      });
      const updatedNote = await storage.updateNote(noteId, noteData);
      res.json(updatedNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      log(`Error updating note: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to update note" });
    }
  });
  
  app.delete("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteNote(id);
      
      if (!success) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      log(`Error deleting note: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to delete note" });
    }
  });
  
  app.post("/api/notes/:id/toggle-key", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedNote = await storage.toggleKeyNote(id);
      
      if (!updatedNote) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      res.json(updatedNote);
    } catch (error) {
      log(`Error toggling key note: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to toggle key note" });
    }
  });
  
  // Email log routes
  app.get("/api/customers/:customerId/email-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const emailLogs = await storage.getEmailLogsForCustomer(customerId);
      res.json(emailLogs);
    } catch (error) {
      log(`Error getting email logs: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get email logs" });
    }
  });
  
  app.post("/api/customers/:customerId/email-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const emailLogData = emailLogSchema.parse({
        ...req.body,
        customerId
      });
      const newEmailLog = await storage.createEmailLog(emailLogData);
      res.status(201).json(newEmailLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      log(`Error creating email log: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to create email log" });
    }
  });
  
  app.delete("/api/email-logs/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEmailLog(id);
      
      if (!success) {
        return res.status(404).json({ error: "Email log not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      log(`Error deleting email log: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to delete email log" });
    }
  });
  
  // Activity log routes
  app.get("/api/activity-logs", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activityLogs = await storage.getAllActivityLogs(limit);
      res.json(activityLogs);
    } catch (error) {
      log(`Error getting activity logs: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get activity logs" });
    }
  });
  
  app.get("/api/customers/:customerId/activity-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const activityLogs = await storage.getActivityLogsForCustomer(customerId);
      res.json(activityLogs);
    } catch (error) {
      log(`Error getting activity logs: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to get activity logs" });
    }
  });
  
  app.post("/api/customers/:customerId/activity-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const activityLogData = activityLogSchema.parse({
        ...req.body,
        customerId
      });
      const newActivityLog = await storage.createActivityLog(activityLogData);
      res.status(201).json(newActivityLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      log(`Error creating activity log: ${error instanceof Error ? error.message : 'Unknown error'}`, "routes");
      res.status(500).json({ error: "Failed to create activity log" });
    }
  });
  
  const server = createServer(app);
  return server;
}
