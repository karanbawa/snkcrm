import { useState } from 'react';
import useCustomerStore from '@/hooks/use-customer-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ExportToExcel() {
  const [isExporting, setIsExporting] = useState(false);
  const { getFilteredCustomers } = useCustomerStore();
  const { toast } = useToast();

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      const customers = getFilteredCustomers();
      
      // Prepare data for export
      const customerData = customers.map(customer => ({
        'Customer Name': customer.name,
        'Returning Customer': customer.isReturningCustomer ? 'Yes' : 'No',
        'Country': customer.country,
        'Region': customer.region,
        'City': customer.city,
        'Contact Person': customer.contactPerson,
        'Email': customer.email,
        'Phone': customer.phone,
        'Website': customer.website,
        'Customer Type': customer.customerType,
        'Status': customer.status,
        'Priority': customer.priority,
        'Tags': customer.tags.join(', '),
        'Value Tier': customer.valueTier,
        'Direct Import': customer.directImport,
        'Last Follow-up Date': customer.lastFollowUpDate,
        'Next Follow-up Date': customer.nextFollowUpDate,
        'Requirements': customer.requirements,
        'Last Contact Notes': customer.lastContactNotes,
        'Key Meeting Points': customer.keyMeetingPoints,
      }));
      
      // Convert to CSV string
      const headers = Object.keys(customerData[0] || {}).join(',');
      const csvRows = customerData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'snk_surfaces_customers.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Completed',
        description: `${customers.length} customers exported to Excel successfully.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the customers data.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={exportToExcel}
      disabled={isExporting}
      className="text-sm"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mr-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      Export
    </Button>
  );
}
