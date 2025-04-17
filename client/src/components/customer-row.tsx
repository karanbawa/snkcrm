import { useState } from 'react';
import { useCustomers } from '@/hooks/use-customers';
import { Customer } from '@/types/customer';
import StatusBadge from '@/components/status-badge';
import PriorityBadge from '@/components/priority-badge';
import ReturningCustomerBadge from '@/components/returning-customer-badge';
import ExpandedCustomerData from '@/components/expanded-customer-data';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CustomerRowProps {
  customer: Customer;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
}

export default function CustomerRow({ customer, isExpanded, onToggleExpand, onEdit }: CustomerRowProps) {
  const { deleteCustomer } = useCustomerStore();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDelete = () => {
    deleteCustomer(customer.id);
    toast({
      title: 'Customer Deleted',
      description: `${customer.name} has been deleted from your database.`,
    });
    setShowDeleteDialog(false);
  };
  
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">
                  {customer.name}
                </div>
                {customer.isReturningCustomer && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Returning
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {customer.city && customer.country ? `${customer.city}, ${customer.country}` : customer.country}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{customer.contactPerson}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{customer.customerType}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={customer.status} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <PriorityBadge priority={customer.priority} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button 
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-500" 
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowDeleteDialog(true)} 
              className="text-gray-400 hover:text-gray-500" 
              aria-label="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={onToggleExpand} 
              className="text-gray-400 hover:text-gray-500" 
              aria-label="Expand"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="expanded-content">
          <td colSpan={6} className="p-0">
            <ExpandedCustomerData customer={customer} />
          </td>
        </tr>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {customer.name} from your customer database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
