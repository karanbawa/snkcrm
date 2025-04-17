import { Link, useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DashboardIcon,
  PersonIcon,
  CalendarIcon,
  ChatBubbleIcon,
  GearIcon,
  ReaderIcon,
  HomeIcon,
  BarChartIcon
} from '@radix-ui/react-icons';

export default function SidebarNavigation() {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  const navItems = [
    {
      name: 'Dashboard',
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
    {
      name: 'Notes',
      href: '/notes',
      icon: <ChatBubbleIcon className="w-5 h-5" />,
      active: location.includes('/notes'),
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: <BarChartIcon className="w-5 h-5" />,
      active: location.includes('/reports'),
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <GearIcon className="w-5 h-5" />,
      active: location.includes('/settings'),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex-none border-r border-gray-200 bg-white py-4 transition-transform">
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="mb-6 px-6">
          <div className="flex items-center">
            <div className="mr-2 rounded-md bg-primary p-1.5 text-white">
              <DashboardIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SNK CRM</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <div key={item.name} className="relative">
              <Link 
                href={item.href}
                className={`
                  group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${item.active 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span 
                  className={`
                    mr-3 flex-shrink-0 
                    ${item.active ? 'text-primary-700' : 'text-gray-500 group-hover:text-gray-600'}
                  `}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-3">
          <div className="space-y-1">
            <a 
              href="#" 
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <span className="mr-3 flex-shrink-0 text-gray-500 group-hover:text-gray-600">
                <ReaderIcon className="h-5 w-5" />
              </span>
              <span>Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}