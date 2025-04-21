import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
// Use storage factory to get the appropriate storage implementation
import { getStorage } from "./storage-factory";
import { z } from "zod";
import { 
  insertCustomerSchema, 
  insertNoteSchema,
  insertEmailLogSchema,
  insertActivityLogSchema,
  Customer,
  Note,
  EmailLog,
  ActivityLog
} from "@shared/schema";
import { log } from "./vite";
import { v4 as uuidv4 } from "uuid";

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
      // Generate a new UUID for the customer
      const customerId = uuidv4();
      
      // Validate request body
      const customerData = insertCustomerSchema.parse({
        ...req.body,
        id: customerId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const newCustomer = await storage.createCustomer(customerData);
      res.status(201).json(newCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      log(`Error creating customer: ${error}`, "routes");
      res.status(500).json({ error: "Failed to create customer" });
    }
  });
  
  app.put("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(id);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      // Validate request body
      const customerData = insertCustomerSchema.parse({
        ...req.body,
        id,
        updatedAt: new Date()
      });
      
      const updatedCustomer = await storage.updateCustomer(id, customerData);
      res.json(updatedCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      log(`Error updating customer: ${error}`, "routes");
      res.status(500).json({ error: "Failed to update customer" });
    }
  });
  
  app.delete("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(id);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      await storage.deleteCustomer(id);
      res.status(204).send();
    } catch (error) {
      log(`Error deleting customer: ${error}`, "routes");
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });
  
  // Notes routes
  app.get("/api/customers/:customerId/notes", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const notes = await storage.getNotesForCustomer(customerId);
      res.json(notes);
    } catch (error) {
      log(`Error getting notes: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get notes" });
    }
  });
  
  app.post("/api/customers/:customerId/notes", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      // Generate a new UUID for the note
      const noteId = uuidv4();
      
      // Validate request body
      const noteData = insertNoteSchema.parse({
        ...req.body,
        id: noteId,
        customerId,
        timestamp: new Date()
      });
      
      const newNote = await storage.createNote(noteData);
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      log(`Error creating note: ${error}`, "routes");
      res.status(500).json({ error: "Failed to create note" });
    }
  });
  
  app.delete("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if note exists
      const existingNote = await storage.getNoteById(id);
      if (!existingNote) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      await storage.deleteNote(id);
      res.status(204).send();
    } catch (error) {
      log(`Error deleting note: ${error}`, "routes");
      res.status(500).json({ error: "Failed to delete note" });
    }
  });
  
  app.patch("/api/notes/:id/toggle-key", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if note exists
      const existingNote = await storage.getNoteById(id);
      if (!existingNote) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      const updatedNote = await storage.toggleKeyNote(id);
      res.json(updatedNote);
    } catch (error) {
      log(`Error toggling key note: ${error}`, "routes");
      res.status(500).json({ error: "Failed to toggle key note" });
    }
  });
  
  // Customer enhancement routes
  app.patch("/api/customers/:id/toggle-hot-lead", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(id);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const updatedCustomer = await storage.toggleHotLead(id);
      
      // Create activity log
      await storage.createActivityLog({
        id: uuidv4(),
        customerId: id,
        action: updatedCustomer?.isHotLead ? "Hot Lead Added" : "Hot Lead Removed",
        description: `Customer was ${updatedCustomer?.isHotLead ? "marked as" : "removed from"} Hot Lead`,
        timestamp: new Date()
      });
      
      res.json(updatedCustomer);
    } catch (error) {
      log(`Error toggling hot lead: ${error}`, "routes");
      res.status(500).json({ error: "Failed to toggle hot lead" });
    }
  });
  
  app.patch("/api/customers/:id/toggle-pinned", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(id);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const updatedCustomer = await storage.togglePinned(id);
      
      // Create activity log
      await storage.createActivityLog({
        id: uuidv4(),
        customerId: id,
        action: updatedCustomer?.isPinned ? "Customer Pinned" : "Customer Unpinned",
        description: `Customer was ${updatedCustomer?.isPinned ? "pinned" : "unpinned"}`,
        timestamp: new Date()
      });
      
      res.json(updatedCustomer);
    } catch (error) {
      log(`Error toggling pinned status: ${error}`, "routes");
      res.status(500).json({ error: "Failed to toggle pinned status" });
    }
  });
  
  // Follow-up calendar routes
  app.get("/api/follow-ups", async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const customers = await storage.getCustomersWithUpcomingFollowUps(days);
      res.json(customers);
    } catch (error) {
      log(`Error getting follow-ups: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get follow-ups" });
    }
  });
  
  // Smart attention routes
  app.get("/api/customers/needs-attention", async (req: Request, res: Response) => {
    try {
      const customers = await storage.getCustomersNeedingAttention();
      res.json(customers);
    } catch (error) {
      log(`Error getting customers needing attention: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get customers needing attention" });
    }
  });
  
  // Email log routes
  app.get("/api/customers/:customerId/email-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const emailLogs = await storage.getEmailLogsForCustomer(customerId);
      res.json(emailLogs);
    } catch (error) {
      log(`Error getting email logs: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get email logs" });
    }
  });
  
  app.post("/api/customers/:customerId/email-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      // Generate a new UUID for the email log
      const emailLogId = uuidv4();
      
      // Validate request body
      const emailLogData = insertEmailLogSchema.parse({
        ...req.body,
        id: emailLogId,
        customerId,
        date: new Date()
      });
      
      const newEmailLog = await storage.createEmailLog(emailLogData);
      
      // Create activity log
      await storage.createActivityLog({
        id: uuidv4(),
        customerId,
        action: "Email Logged",
        description: `Email "${emailLogData.subject}" was logged`,
        timestamp: new Date()
      });
      
      res.status(201).json(newEmailLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      log(`Error creating email log: ${error}`, "routes");
      res.status(500).json({ error: "Failed to create email log" });
    }
  });
  
  // Activity log routes
  app.get("/api/activity-logs", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || undefined;
      const activityLogs = await storage.getAllActivityLogs(limit);
      res.json(activityLogs);
    } catch (error) {
      log(`Error getting activity logs: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get activity logs" });
    }
  });
  
  app.get("/api/customers/:customerId/activity-logs", async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      
      // Check if customer exists
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const activityLogs = await storage.getActivityLogsForCustomer(customerId);
      res.json(activityLogs);
    } catch (error) {
      log(`Error getting activity logs: ${error}`, "routes");
      res.status(500).json({ error: "Failed to get activity logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
