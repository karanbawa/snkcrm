import { useState } from 'react';
import Header from '@/components/header';
import CustomerTable from '@/components/customer-table';
import CustomerSearchFilters from '@/components/customer-search-filters';
import AddCustomerModal from '@/components/add-customer-modal';
import ExportToExcel from '@/components/export-to-excel';
import FollowUpCalendar from '@/components/follow-up-calendar';
import ActivityFeed from '@/components/activity-feed';
import QuickAddLead from '@/components/quick-add-lead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('customers');
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Customer Database</h2>
            <p className="mt-1 text-sm text-gray-500">Manage all your customers, leads, and interactions</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <ExportToExcel />
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-black font-bold text-lg py-3 px-6 rounded-md flex items-center transition-colors duration-200 shadow-lg"
            >
              <span className="mr-2 text-xl">+</span>
              <span>ADD NEW CUSTOMER</span>
            </button>
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="customers" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="calendar">Follow-up Calendar</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-6">
            {/* Search & Filters */}
            <CustomerSearchFilters />
            
            {/* Customer Table */}
            <CustomerTable />
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardContent className="p-6">
                <FollowUpCalendar />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardContent className="p-6">
                <ActivityFeed />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Modals */}
      {isAddModalOpen && (
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      
      {/* Quick Add Lead Floating Button */}
      <QuickAddLead />
    </div>
  );
}
