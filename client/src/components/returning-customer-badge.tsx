import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';

interface ReturningCustomerBadgeProps {
  className?: string;
}

export default function ReturningCustomerBadge({ className }: ReturningCustomerBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800',
      className
    )}>
      <BadgeCheck className="w-3.5 h-3.5 mr-1" />
      Returning
    </div>
  );
}