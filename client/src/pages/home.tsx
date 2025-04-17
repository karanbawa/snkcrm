import { useState } from 'react';
import Header from '@/components/header';
import CustomerTable from '@/components/customer-table';
import CustomerSearchFilters from '@/components/customer-search-filters';
import AddCustomerModal from '@/components/add-customer-modal';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-200"
            >
              <span className="mr-2">+</span>
              <span>Add Customer</span>
            </button>
          </div>
        </div>
        
        {/* Search & Filters */}
        <CustomerSearchFilters />
        
        {/* Customer Table */}
        <CustomerTable />
      </main>
      
      {/* Modals */}
      {isAddModalOpen && (
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
