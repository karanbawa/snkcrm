import { CustomerStatus } from '@/types/customer';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: CustomerStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Define status color variants
  const statusVariants: Record<CustomerStatus, { bg: string, text: string }> = {
    'Lead': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Email Sent': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'Meeting Scheduled': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    'Negotiation': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'Won': { bg: 'bg-green-100', text: 'text-green-800' },
    'Lost': { bg: 'bg-red-100', text: 'text-red-800' }
  };
  
  const { bg, text } = statusVariants[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      bg, text
    )}>
      {status}
    </span>
  );
}