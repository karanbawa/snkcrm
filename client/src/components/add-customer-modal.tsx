import { useState } from 'react';
import useCustomerStore from '@/hooks/use-customer-store';
import { Customer, Priority, CustomerStatus, CustomerType, ValueTier, DirectImport } from '@/types/customer';
import { useToast } from '@/hooks/use-toast';
import TagInput from '@/components/tag-input';

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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const { addCustomer } = useCustomerStore();
  const { toast } = useToast();
  
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  
  // Basic Info
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  
  // Contact Info
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  
  // Business Details
  const [customerType, setCustomerType] = useState<CustomerType | ''>('');
  const [requirements, setRequirements] = useState('');
  const [status, setStatus] = useState<CustomerStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [valueTier, setValueTier] = useState<ValueTier>('');
  const [directImport, setDirectImport] = useState<DirectImport>('');
  
  // Dates
  const [lastFollowUpDate, setLastFollowUpDate] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  
  // Notes
  const [lastContactNotes, setLastContactNotes] = useState('');
  const [keyMeetingPoints, setKeyMeetingPoints] = useState('');
  
  const validateForm = (): boolean => {
    if (!name) {
      toast({
        title: "Customer Name Required",
        description: "Please provide a customer name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!country) {
      toast({
        title: "Country Required",
        description: "Please select a country.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!contactPerson) {
      toast({
        title: "Contact Person Required",
        description: "Please provide a contact person name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide an email address.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!customerType) {
      toast({
        title: "Customer Type Required",
        description: "Please select a customer type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!status) {
      toast({
        title: "Status Required",
        description: "Please select a customer status.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!priority) {
      toast({
        title: "Priority Required",
        description: "Please select a priority level.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      isReturningCustomer,
      
      // Basic Info
      name,
      country,
      region,
      city,
      
      // Contact Info
      contactPerson,
      email,
      phone,
      website,
      
      // Business Details
      customerType: customerType as CustomerType,
      requirements,
      status: status as CustomerStatus,
      priority: priority as Priority,
      tags,
      valueTier,
      directImport,
      
      // Dates
      lastFollowUpDate,
      nextFollowUpDate,
      
      // Notes
      lastContactNotes,
      keyMeetingPoints,
      // Notes are added separately through the API
    };
    
    addCustomer(newCustomer);
    
    toast({
      title: "Customer Added",
      description: `${name} has been added to your database.`,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Fill in the customer information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4 col-span-2">
            <div className="flex items-center">
              <Label htmlFor="returning-customer" className="mr-3">Returning Customer</Label>
              <Switch 
                id="returning-customer"
                checked={isReturningCustomer}
                onCheckedChange={setIsReturningCustomer}
              />
            </div>
            
            <div>
              <Label htmlFor="customer-name">Customer Name <span className="text-red-500">*</span></Label>
              <Input 
                id="customer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            {/* Location Information */}
            <div>
              <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select a country</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="region">Region</Label>
              <Input 
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Input 
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1"
              />
            </div>
            
            {/* Contact Information */}
            <div>
              <Label htmlFor="contact-person">Contact Person <span className="text-red-500">*</span></Label>
              <Input 
                id="contact-person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1"
              />
            </div>
            
            {/* Business Details */}
            <div>
              <Label htmlFor="customer-type">Customer Type <span className="text-red-500">*</span></Label>
              <Select value={customerType} onValueChange={(value) => setCustomerType(value as CustomerType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select type</SelectItem>
                  <SelectItem value="Retailer">Retailer</SelectItem>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                  <SelectItem value="Contractor">Contractor</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Architect">Architect</SelectItem>
                  <SelectItem value="Builder">Builder</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
              <Select value={status} onValueChange={(value) => setStatus(value as CustomerStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select status</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Email Sent">Email Sent</SelectItem>
                  <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="value-tier">Value Tier</Label>
              <Select value={valueTier} onValueChange={(value) => setValueTier(value as ValueTier)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select tier</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="direct-import">Direct Import</Label>
              <Select value={directImport} onValueChange={(value) => setDirectImport(value as DirectImport)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select option</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Dates */}
            <div>
              <Label htmlFor="last-followup">Last Follow-up Date</Label>
              <Input 
                id="last-followup"
                type="date"
                value={lastFollowUpDate}
                onChange={(e) => setLastFollowUpDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="next-followup">Next Follow-up Date</Label>
              <Input 
                id="next-followup"
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            {/* Requirements and Notes */}
            <div className="col-span-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea 
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="contact-notes">Last Contact Notes</Label>
              <Textarea 
                id="contact-notes"
                value={lastContactNotes}
                onChange={(e) => setLastContactNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="key-points">Key Meeting Points</Label>
              <Textarea 
                id="key-points"
                value={keyMeetingPoints}
                onChange={(e) => setKeyMeetingPoints(e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
            
            {/* Tags */}
            <div className="col-span-2">
              <Label htmlFor="tags" className="mb-1 block">Tags</Label>
              <TagInput tags={tags} setTags={setTags} />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
