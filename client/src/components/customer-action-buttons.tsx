import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Pin, PinOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Customer } from '@/types/customer';
import { useToast } from '@/hooks/use-toast';

interface CustomerActionButtonsProps {
  customer: Customer;
  onToggleHotLead: (id: string) => void;
  onTogglePinned: (id: string) => void;
  size?: 'sm' | 'default';
}

export default function CustomerActionButtons({
  customer,
  onToggleHotLead,
  onTogglePinned,
  size = 'default'
}: CustomerActionButtonsProps) {
  const { toast } = useToast();
  
  const handleToggleHotLead = () => {
    onToggleHotLead(customer.id);
    
    toast({
      title: customer.isHotLead ? 'Hot Lead Removed' : 'Hot Lead Added',
      description: `${customer.name} has been ${customer.isHotLead ? 'removed from' : 'marked as'} Hot Lead`,
    });
  };
  
  const handleTogglePinned = () => {
    onTogglePinned(customer.id);
    
    toast({
      title: customer.isPinned ? 'Customer Unpinned' : 'Customer Pinned',
      description: `${customer.name} has been ${customer.isPinned ? 'unpinned' : 'pinned to the top'}`,
    });
  };
  
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={customer.isHotLead ? "destructive" : "outline"}
              size="icon"
              className={buttonSize}
              onClick={handleToggleHotLead}
            >
              <Flame className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{customer.isHotLead ? 'Remove Hot Lead' : 'Mark as Hot Lead'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={customer.isPinned ? "secondary" : "outline"}
              size="icon"
              className={buttonSize}
              onClick={handleTogglePinned}
            >
              {customer.isPinned ? (
                <PinOff className={iconSize} />
              ) : (
                <Pin className={iconSize} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{customer.isPinned ? 'Unpin Customer' : 'Pin Customer'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}