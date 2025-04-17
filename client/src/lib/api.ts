import { Customer, Note } from '@/types/customer';
import { apiRequest } from './queryClient';

// Customer API functions
export async function fetchCustomers(): Promise<Customer[]> {
  return await apiRequest<Customer[]>({ 
    url: '/api/customers',
    method: 'GET'
  });
}

export async function fetchCustomer(id: string): Promise<Customer> {
  return await apiRequest<Customer>({ 
    url: `/api/customers/${id}`,
    method: 'GET'
  });
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  return await apiRequest<Customer>({ 
    url: '/api/customers',
    method: 'POST',
    data: customer
  });
}

export async function updateCustomer(id: string, customer: Customer): Promise<Customer> {
  return await apiRequest<Customer>({ 
    url: `/api/customers/${id}`,
    method: 'PUT',
    data: customer
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiRequest<void>({ 
    url: `/api/customers/${id}`,
    method: 'DELETE'
  });
}

// Note API functions
export async function fetchCustomerNotes(customerId: string): Promise<Note[]> {
  return await apiRequest<Note[]>({ 
    url: `/api/customers/${customerId}/notes`,
    method: 'GET'
  });
}

export async function createNote(customerId: string, note: Omit<Note, 'id' | 'timestamp'>): Promise<Note> {
  return await apiRequest<Note>({ 
    url: `/api/customers/${customerId}/notes`,
    method: 'POST',
    data: note
  });
}

export async function deleteNote(noteId: string): Promise<void> {
  await apiRequest<void>({ 
    url: `/api/notes/${noteId}`,
    method: 'DELETE'
  });
}

export async function toggleKeyNote(noteId: string): Promise<Note> {
  return await apiRequest<Note>({ 
    url: `/api/notes/${noteId}/toggle-key`,
    method: 'PATCH'
  });
}