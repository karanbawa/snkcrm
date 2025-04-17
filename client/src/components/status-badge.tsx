import { CustomerStatus } from '@/types/customer';

interface StatusBadgeProps {
  status: CustomerStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeClass = () => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-100 text-blue-800';
      case 'Email Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Meeting Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Negotiation':
        return 'bg-indigo-100 text-indigo-800';
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getBadgeClass()}`}>
      {status}
    </span>
  );
}
