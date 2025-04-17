import { useState, useEffect, useCallback } from 'react';
import { storage, generateId } from '@/lib/utils';
import { Customer, CustomerNote, CustomerStatus, CustomerType, CustomerPriority } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

type FilterState = {
  search: string;
  country: string;
  status: string;
  priority: string;
  customerType: string;
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    country: '',
    status: '',
    priority: '',
    customerType: '',
  });
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const storedCustomers = storage.getCustomers();
    const storedNotes = storage.getNotes();
    setCustomers(storedCustomers);
    setNotes(storedNotes);
    setIsLoading(false);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      storage.saveCustomers(customers);
    }
  }, [customers, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.saveNotes(notes);
    }
  }, [notes, isLoading]);

  // Get filtered customers
  const filteredCustomers = useCallback(() => {
    return customers.filter(customer => {
      // Apply filters
      if (filters.country && customer.country !== filters.country) return false;
      if (filters.status && customer.status !== filters.status) return false;
      if (filters.priority && customer.priority !== filters.priority) return false;
      if (filters.customerType && customer.customerType !== filters.customerType) return false;

      // Apply search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = customer.name.toLowerCase().includes(searchLower);
        const matchesTags = customer.tags.some(tag => tag.toLowerCase().includes(searchLower));
        const matchesRequirements = customer.requirements.toLowerCase().includes(searchLower);
        
        return matchesName || matchesTags || matchesRequirements;
      }

      return true;
    });
  }, [customers, filters]);

  // CRUD operations for customers
  const addCustomer = useCallback((customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Customer added",
      description: `${customer.name} has been added to your customers.`,
    });
    
    return newCustomer;
  }, [toast]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id 
          ? { 
              ...customer, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : customer
      )
    );
    toast({
      title: "Customer updated",
      description: "The customer information has been updated.",
    });
  }, [toast]);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    // Also delete associated notes
    setNotes(prev => prev.filter(note => note.customerId !== id));
    toast({
      title: "Customer deleted",
      description: "The customer and all associated data have been removed.",
    });
  }, [toast]);

  const getCustomerById = useCallback((id: string) => {
    return customers.find(customer => customer.id === id);
  }, [customers]);

  // CRUD operations for notes
  const getNotesForCustomer = useCallback((customerId: string) => {
    return notes.filter(note => note.customerId === customerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notes]);

  const addNote = useCallback((note: Omit<CustomerNote, 'id' | 'timestamp'>) => {
    const newNote: CustomerNote = {
      ...note,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    setNotes(prev => [...prev, newNote]);
    toast({
      title: "Note added",
      description: "Your note has been saved.",
    });
    
    return newNote;
  }, [toast]);

  const updateNote = useCallback((id: string, updates: Partial<CustomerNote>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates } 
          : note
      )
    );
    toast({
      title: "Note updated",
      description: "Your note has been updated.",
    });
  }, [toast]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "The note has been removed.",
    });
  }, [toast]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    customers,
    filteredCustomers: filteredCustomers(),
    notes,
    filters,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    getNotesForCustomer,
    addNote,
    updateNote,
    deleteNote,
    updateFilters,
  };
}
