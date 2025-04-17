import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/use-customers';
import { PlusCircle } from 'lucide-react';
import { CustomerType } from '@/types/customer';
import { v4 as uuidv4 } from 'uuid';

interface QuickLeadFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  customerType: CustomerType;
}

export default function QuickAddLead() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { createCustomer } = useCustomers();
  
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<QuickLeadFormData>({
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: '',
      customerType: 'Retailer',
    }
  });
  
  const onSubmit = async (data: QuickLeadFormData) => {
    try {
      // Create a new customer with minimal data, other fields will have defaults
      await createCustomer({
        id: uuidv4(),
        isReturningCustomer: false,
        name: data.name,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        country: data.country,
        region: '',
        city: '',
        website: '',
        customerType: data.customerType,
        requirements: '',
        status: 'Lead',
        priority: 'Medium',
        tags: [],
        valueTier: 'Standard',
        directImport: 'No',
        lastFollowUpDate: '',
        nextFollowUpDate: '',
        lastContactNotes: '',
        keyMeetingPoints: '',
        isHotLead: true,
        isPinned: false,
      });
      
      toast({
        title: 'Lead Added',
        description: `${data.name} has been added as a new lead`,
      });
      
      // Reset form and close sheet
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to add lead. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCustomerTypeChange = (value: string) => {
    setValue('customerType', value as CustomerType);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg">
          <PlusCircle size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Add Lead</SheetTitle>
          <SheetDescription>
            Add a new lead with minimal information. You can fill in more details later.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              {...register('name', { required: 'Company name is required' })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person <span className="text-red-500">*</span></Label>
            <Input 
              id="contactPerson" 
              {...register('contactPerson', { required: 'Contact person is required' })}
              className={errors.contactPerson ? 'border-red-500' : ''}
            />
            {errors.contactPerson && (
              <p className="text-red-500 text-xs mt-1">{errors.contactPerson.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input 
              id="email" 
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              {...register('phone')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
            <Input 
              id="country" 
              {...register('country', { required: 'Country is required' })}
              className={errors.country ? 'border-red-500' : ''}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerType">Customer Type <span className="text-red-500">*</span></Label>
            <Select 
              onValueChange={handleCustomerTypeChange}
              defaultValue="Retailer"
            >
              <SelectTrigger id="customerType">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
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
          
          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Lead'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}