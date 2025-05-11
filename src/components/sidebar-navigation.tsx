"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  Activity, 
  Settings,
  BarChart,
  Handshake,
  ListTodo,
  FileText
} from 'lucide-react';

const navigation = [
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Deals', href: '/deals', icon: Handshake },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r h-[calc(100vh-4rem)]">
      <div className="space-y-1 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 