import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Customer, Note, CustomerStatus, Priority, CustomerType } from '@/types/customer';
import { useState } from 'react';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import * as api from '@/lib/api';

type FilterState = {
  search: string;
  country: string;
  status: string;
  priority: string;
  customerType: string;
};

export function useCustomers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    country: '',
    status: '',
    priority: '',
    customerType: '',
  });

  // Fetch all customers
  const { data: customers = [], isLoading, isError } = useQuery({
    queryKey: ['/api/customers'],
    queryFn: api.fetchCustomers,
  });

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !filters.search || 
      customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase())) ||
      customer.requirements.toLowerCase().includes(filters.search.toLowerCase());
      
    const matchesCountry = !filters.country || customer.country === filters.country;
    const matchesStatus = !filters.status || customer.status === filters.status;
    const matchesPriority = !filters.priority || customer.priority === filters.priority;
    const matchesType = !filters.customerType || customer.customerType === filters.customerType;
    
    return matchesSearch && matchesCountry && matchesStatus && matchesPriority && matchesType;
  });

  // Add a new customer
  const addCustomerMutation = useMutation({
    mutationFn: (newCustomer: Omit<Customer, 'id'>) => {
      return api.createCustomer(newCustomer);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Customer added successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add customer',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // Delete a customer
  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => {
      return api.deleteCustomer(id);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete customer',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // Update a customer
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, customer }: { id: string; customer: Customer }) => {
      return api.updateCustomer(id, customer);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // Add a note to a customer
  const addNoteMutation = useMutation({
    mutationFn: ({ customerId, note }: { customerId: string; note: Omit<Note, 'id' | 'timestamp'> }) => {
      return api.createNote(customerId, note);
    },
    onSuccess: (_, { customerId }) => {
      toast({
        title: 'Success',
        description: 'Note added successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers', customerId, 'notes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: ({ noteId, customerId }: { noteId: string; customerId: string }) => {
      return api.deleteNote(noteId);
    },
    onSuccess: (_, { customerId }) => {
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers', customerId, 'notes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // Toggle key note
  const toggleKeyNoteMutation = useMutation({
    mutationFn: ({ noteId, customerId }: { noteId: string; customerId: string }) => {
      return api.toggleKeyNote(noteId);
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({
        queryKey: ['/api/customers', customerId, 'notes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to toggle key note',
        variant: 'destructive',
      });
      console.error(error);
    }
  });
  
  // Toggle hot lead
  const toggleHotLeadMutation = useMutation({
    mutationFn: (customerId: string) => {
      return api.toggleHotLead(customerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/activity-logs'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to toggle hot lead status',
        variant: 'destructive',
      });
      console.error(error);
    }
  });
  
  // Toggle pinned status
  const togglePinnedMutation = useMutation({
    mutationFn: (customerId: string) => {
      return api.togglePinned(customerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/customers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/activity-logs'],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to toggle pinned status',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // Hook for fetching notes for a specific customer
  const useCustomerNotes = (customerId: string) => {
    return useQuery({
      queryKey: ['/api/customers', customerId, 'notes'],
      queryFn: () => api.fetchCustomerNotes(customerId),
      enabled: !!customerId
    });
  };

  return {
    customers: filteredCustomers,
    isLoading,
    isError,
    addCustomer: (customer: Omit<Customer, 'id'>) => addCustomerMutation.mutate(customer),
    createCustomer: (customer: Customer) => {
      // This is for components that need to create a pre-formed customer with ID
      return api.createCustomer(customer)
        .then((createdCustomer) => {
          queryClient.invalidateQueries({
            queryKey: ['/api/customers'],
          });
          toast({
            title: 'Success',
            description: 'Customer added successfully',
          });
          return createdCustomer;
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Failed to add customer',
            variant: 'destructive',
          });
          console.error(error);
          throw error;
        });
    },
    deleteCustomer: (id: string) => deleteCustomerMutation.mutate(id),
    updateCustomer: (id: string, customer: Customer) => updateCustomerMutation.mutate({ id, customer }),
    addNote: (customerId: string, note: Omit<Note, 'id' | 'timestamp'>) => addNoteMutation.mutate({ customerId, note }),
    deleteNote: (customerId: string, noteId: string) => deleteNoteMutation.mutate({ customerId, noteId }),
    toggleKeyNote: (customerId: string, noteId: string) => toggleKeyNoteMutation.mutate({ customerId, noteId }),
    useCustomerNotes,
    
    // Filters
    filters,
    setFilter: (key: keyof FilterState, value: string) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    resetFilters: () => {
      setFilters({
        search: '',
        country: '',
        status: '',
        priority: '',
        customerType: '',
      });
    }
  };
}