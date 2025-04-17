import { Priority } from '@/types/customer';

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getBadgeClass = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getBadgeClass()}`}>
      {priority}
    </span>
  );
}
