import { ReactNode } from 'react';
import SidebarNavigation from './sidebar-navigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarNavigation />
      
      <main className={`transition-all ${isMobile ? 'pl-0' : 'pl-64'}`}>
        <div className="container mx-auto max-w-7xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}