import { Priority } from '@/types/customer';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  // Define color variants based on priority
  const priorityVariants: Record<Priority, { bg: string, text: string, indicator: string }> = {
    'High': { 
      bg: 'bg-red-100', 
      text: 'text-red-800',
      indicator: 'bg-red-500'
    },
    'Medium': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800',
      indicator: 'bg-yellow-500'
    },
    'Low': { 
      bg: 'bg-green-100', 
      text: 'text-green-800',
      indicator: 'bg-green-500'
    }
  };
  
  const { bg, text, indicator } = priorityVariants[priority] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800',
    indicator: 'bg-gray-500'
  };
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      bg, text
    )}>
      <span className={cn('w-2 h-2 mr-1.5 rounded-full', indicator)} />
      {priority}
    </span>
  );
}