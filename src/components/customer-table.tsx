"use client"

import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import EditCustomerModal from './edit-customer-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'lead' | 'customer' | 'inactive';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes?: string[];
  followUps?: string[];
}

interface CustomerTableProps {
  searchParams: {
    search?: string;
    status?: string;
    priority?: string;
  };
  onRefresh?: () => void;
}

export default function CustomerTable({ searchParams, onRefresh }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.search) queryParams.append('search', searchParams.search);
      if (searchParams.status) queryParams.append('status', searchParams.status);
      if (searchParams.priority) queryParams.append('priority', searchParams.priority);

      const response = await fetch(`/api/customers?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load customers');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load customers. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      setCustomers(customers.filter(customer => customer._id !== id));
      setDeletingCustomer(null);
      toast({ title: 'Success', description: 'Customer deleted successfully' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer({
      ...customer,
      notes: (customer as any).notes ?? [],
      followUps: (customer as any).followUps ?? [],
    });
  };

  const handleEditComplete = () => {
    setEditingCustomer(null);
    fetchCustomers();
    if (onRefresh) onRefresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer._id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    customer.status === 'customer'
                      ? 'default'
                      : customer.status === 'lead'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    customer.priority === 'high'
                      ? 'destructive'
                      : customer.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {customer.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeletingCustomer(customer)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={{
            ...editingCustomer,
            notes: Array.isArray(editingCustomer.notes)
              ? (editingCustomer.notes as any[]).map(note =>
                  typeof note === 'string' ? { content: note } : note
                )
              : [],
            followUps: Array.isArray(editingCustomer.followUps)
              ? (editingCustomer.followUps as any[]).map(fu =>
                  typeof fu === 'string'
                    ? { date: '', notes: fu, status: 'pending' }
                    : fu
                )
              : [],
          }}
          onClose={handleEditComplete}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCustomer} onOpenChange={() => setDeletingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <b>{deletingCustomer?.name}</b>?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeletingCustomer(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deletingCustomer!._id)}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 