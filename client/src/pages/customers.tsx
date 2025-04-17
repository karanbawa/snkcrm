import CustomerTable from '@/components/customer-table';
import CustomerSearchFilters from '@/components/customer-search-filters';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import AddCustomerModal from '@/components/add-customer-modal';
import ImportCustomers from '@/components/import-customers';
import ExportToExcel from '@/components/export-to-excel';

export default function CustomersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-500">Manage your customer database</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ImportCustomers />
          <ExportToExcel />
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1 shadow-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>
      
      {/* Search & Filters */}
      <CustomerSearchFilters />
      
      {/* Customer Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <CustomerTable />
      </div>
      
      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}