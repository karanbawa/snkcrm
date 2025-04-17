import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  PersonIcon,
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  GearIcon,
  ReaderIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Consider using CMD+K for keyboard navigation
const useKeyboardShortcut = (key: string, modifier: string, action: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierPressed = modifier === 'ctrl' ? event.ctrlKey : event.metaKey;
      
      if (modifierPressed && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        action();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, modifier, action]);
};

export default function SidebarNavigation() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  
  // Keyboard shortcut for quick navigation
  useKeyboardShortcut('k', 'meta', () => {
    toast({
      title: "Keyboard Navigation",
      description: "Quick navigation panel would open here",
    });
  });

  const mainNavItems = [
    {
      name: 'Home / Dashboard',
      href: '/',
      icon: <HomeIcon className="w-5 h-5" />,
      active: location === '/',
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: <PersonIcon className="w-5 h-5" />,
      active: location.includes('/customers'),
    },
    {
      name: 'Follow-ups',
      href: '/follow-ups',
      icon: <CalendarIcon className="w-5 h-5" />,
      active: location.includes('/follow-ups'),
    },
  ];
  
  const utilityNavItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: <GearIcon className="w-5 h-5" />,
      active: location.includes('/settings'),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex-none border-r border-gray-200 bg-white shadow-sm transition-transform">
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="border-b border-gray-100 py-5 px-6">
          <div className="flex items-center">
            <div className="mr-2 rounded-md bg-gradient-to-br from-primary to-primary/80 p-1.5 text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">SNK Surfaces</span>
          </div>
        </div>

        {/* Main Navigation Section */}
        <div className="flex-1 px-4 py-4">
          <div className="mb-4">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Main
            </h2>
          </div>
          
          <nav className="space-y-1 mb-8">
            {mainNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${item.active 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span 
                  className={`
                    mr-3 flex-shrink-0 
                    ${item.active ? 'text-primary' : 'text-gray-500 group-hover:text-gray-900'}
                  `}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>
                )}
              </Link>
            ))}
          </nav>
          
          {/* Add Section */}
          <div className="mb-4">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </h2>
          </div>
          
          <div className="space-y-2 px-3 mb-8">
            <Button 
              onClick={() => navigate('/customers')}
              variant="outline" 
              className="w-full justify-start space-x-2 border-dashed border-gray-300"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Customer</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/follow-ups')}
              variant="outline" 
              className="w-full justify-start space-x-2 border-dashed border-gray-300"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Schedule Follow-up</span>
            </Button>
            
            <Button 
              onClick={() => {
                toast({
                  title: "Quick Search",
                  description: "Search functionality would open here",
                });
              }}
              variant="outline" 
              className="w-full justify-start space-x-2 border-dashed border-gray-300"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
          
          {/* Utility Section */}
          <div className="mb-4">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Settings
            </h2>
          </div>
          
          <nav className="space-y-1">
            {utilityNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${item.active 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span 
                  className={`
                    mr-3 flex-shrink-0 
                    ${item.active ? 'text-primary' : 'text-gray-500 group-hover:text-gray-900'}
                  `}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center rounded-md bg-gray-50 p-3 text-sm">
            <div className="mr-3 flex-shrink-0 rounded-full bg-primary/20 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Need help?</p>
              <p className="text-xs text-gray-500">Press <kbd className="rounded border border-gray-200 bg-gray-100 px-1 py-0.5 text-xs">⌘ K</kbd> for commands</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}