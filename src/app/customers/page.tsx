'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Layout from '@/components/layout';
import CustomerTable from '@/components/customer-table';
import CustomerSearchFilters from '@/components/customer-search-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddCustomerModal from '@/components/add-customer-modal';

function CustomersPageContent() {
  'use client';
  const { useState } = require('react');
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev: number) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <AddCustomerModal onSuccess={handleRefresh}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </AddCustomerModal>
      </div>
      <CustomerSearchFilters />
      <CustomerTable
        searchParams={{
          search: searchParams.get('search') || undefined,
          status: searchParams.get('status') || undefined,
          priority: searchParams.get('priority') || undefined,
        }}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersPageContent />
      </Suspense>
    </Layout>
  );
} 