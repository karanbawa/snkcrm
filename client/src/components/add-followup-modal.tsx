import { useState } from 'react';
import { useCustomers } from '@/hooks/use-customers';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types/customer';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFollowupModal({ isOpen, onClose }: AddFollowupModalProps) {
  const { customers, updateCustomer } = useCustomers();
  const { toast } = useToast();
  
  const [customerId, setCustomerId] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const handleSubmit = () => {
    // Validate form
    if (!customerId) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for the follow-up.",
        variant: "destructive",
      });
      return;
    }
    
    if (!followUpDate) {
      toast({
        title: "Follow-up Date Required",
        description: "Please select a follow-up date.",
        variant: "destructive",
      });
      return;
    }
    
    // Find the selected customer
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      toast({
        title: "Error",
        description: "Selected customer not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the customer with new follow-up date
    const updatedCustomer: Customer = {
      ...customer,
      nextFollowUpDate: followUpDate,
      lastContactNotes: notes ? `${notes}\n${customer.lastContactNotes || ''}` : customer.lastContactNotes,
    };
    
    updateCustomer(customerId, updatedCustomer);
    
    toast({
      title: "Follow-up Scheduled",
      description: `Follow-up for ${customer.name} scheduled for ${new Date(followUpDate).toLocaleDateString()}.`,
    });
    
    // Reset form and close modal
    setCustomerId('');
    setFollowUpDate('');
    setNotes('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Follow-up</DialogTitle>
          <DialogDescription>
            Schedule a follow-up with a customer. You'll receive a reminder on the specified date.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer">Customer <span className="text-red-500">*</span></Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="follow-up-date">Follow-up Date <span className="text-red-500">*</span></Label>
            <Input 
              id="follow-up-date"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              placeholder="Enter any notes for this follow-up"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Schedule Follow-up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}