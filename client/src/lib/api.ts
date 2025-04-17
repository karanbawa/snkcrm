import { Customer, Note, EmailLog, ActivityLog } from '@/types/customer';
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

export async function createCustomer(customer: any): Promise<Customer> {
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

// Hot lead and pinning API functions
export async function toggleHotLead(customerId: string): Promise<Customer> {
  return await apiRequest<Customer>({ 
    url: `/api/customers/${customerId}/toggle-hot-lead`,
    method: 'PATCH'
  });
}

export async function togglePinned(customerId: string): Promise<Customer> {
  return await apiRequest<Customer>({ 
    url: `/api/customers/${customerId}/toggle-pinned`,
    method: 'PATCH'
  });
}

// Follow-up and smart reminders API functions
export async function fetchFollowUps(days: number = 7): Promise<Customer[]> {
  return await apiRequest<Customer[]>({ 
    url: `/api/follow-ups?days=${days}`,
    method: 'GET'
  });
}

export async function fetchCustomersNeedingAttention(): Promise<Customer[]> {
  return await apiRequest<Customer[]>({ 
    url: `/api/customers/needs-attention`,
    method: 'GET'
  });
}

// Email log API functions
export async function fetchEmailLogs(customerId: string): Promise<EmailLog[]> {
  return await apiRequest<EmailLog[]>({ 
    url: `/api/customers/${customerId}/email-logs`,
    method: 'GET'
  });
}

export async function createEmailLog(customerId: string, emailLog: Omit<EmailLog, 'id' | 'date'>): Promise<EmailLog> {
  return await apiRequest<EmailLog>({ 
    url: `/api/customers/${customerId}/email-logs`,
    method: 'POST',
    data: emailLog
  });
}

export async function deleteEmailLog(emailLogId: string): Promise<void> {
  await apiRequest<void>({ 
    url: `/api/email-logs/${emailLogId}`,
    method: 'DELETE'
  });
}

// Activity log API functions
export async function fetchActivityLogs(limit?: number): Promise<ActivityLog[]> {
  return await apiRequest<ActivityLog[]>({ 
    url: limit ? `/api/activity-logs?limit=${limit}` : '/api/activity-logs',
    method: 'GET'
  });
}

export async function fetchCustomerActivityLogs(customerId: string): Promise<ActivityLog[]> {
  return await apiRequest<ActivityLog[]>({ 
    url: `/api/customers/${customerId}/activity-logs`,
    method: 'GET'
  });
}