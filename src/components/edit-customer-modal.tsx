"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  status: z.enum(['lead', 'customer', 'inactive']),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.string().optional(),
  notes: z.array(z.object({
    content: z.string(),
  })).optional(),
  followUps: z.array(z.object({
    date: z.string(),
    notes: z.string(),
    status: z.enum(['pending', 'completed', 'cancelled']),
  })).optional(),
});

interface EditCustomerModalProps {
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: 'lead' | 'customer' | 'inactive';
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    notes: Array<{ content: string }>;
    followUps: Array<{
      date: string;
      notes: string;
      status: 'pending' | 'completed' | 'cancelled';
    }>;
  };
  onClose: () => void;
}

export default function EditCustomerModal({ customer, onClose }: EditCustomerModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<string[]>(customer.notes.map(note => note.content));
  const [newNote, setNewNote] = useState('');
  const [followUps, setFollowUps] = useState(customer.followUps);
  const [newFollowUp, setNewFollowUp] = useState<{
    date: string;
    notes: string;
    status: 'pending' | 'completed' | 'cancelled';
  }>({ date: '', notes: '', status: 'pending' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      priority: customer.priority,
      tags: customer.tags?.join(', '),
      notes: customer.notes,
      followUps: customer.followUps,
    },
  });

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  const removeNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const addFollowUp = () => {
    if (newFollowUp.date && newFollowUp.notes) {
      setFollowUps([...followUps, { ...newFollowUp }]);
      setNewFollowUp({ date: '', notes: '', status: 'pending' });
    }
  };

  const removeFollowUp = (index: number) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${customer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          tags: values.tags ? values.tags.split(',').map((tag) => tag.trim()) : [],
          notes: notes.map(content => ({ content })),
          followUps: followUps,
        }),
      });
      if (!response.ok) throw new Error('Failed to update customer');
      toast({ title: 'Success', description: 'Customer updated successfully' });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update customer. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter customer email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter customer phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated tags" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <FormLabel>Notes</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note"
                />
                <Button type="button" onClick={addNote}>
                  Add Note
                </Button>
              </div>
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <p className="flex-1">{note}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNote(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-ups Section */}
            <div className="space-y-2">
              <FormLabel>Follow-ups</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="date"
                  value={newFollowUp.date}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })}
                />
                <Input
                  value={newFollowUp.notes}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })}
                  placeholder="Follow-up notes"
                />
                <Select
                  value={newFollowUp.status}
                  onValueChange={(value: 'pending' | 'completed' | 'cancelled') =>
                    setNewFollowUp({ ...newFollowUp, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={addFollowUp}>
                Add Follow-up
              </Button>
              <div className="space-y-2">
                {followUps.map((followUp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <p>Date: {followUp.date}</p>
                      <p>Notes: {followUp.notes}</p>
                      <p>Status: {followUp.status}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFollowUp(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 