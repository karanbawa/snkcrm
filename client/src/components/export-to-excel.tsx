import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/use-customers';
import { Customer } from '@/types/customer';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportToExcel() {
  const { customers } = useCustomers();
  
  const handleExport = () => {
    // Format the data for Excel
    const customersData = customers.map(customer => ({
      'Customer Name': customer.name,
      'Country': customer.country,
      'Region': customer.region,
      'City': customer.city,
      'Contact Person': customer.contactPerson,
      'Email': customer.email,
      'Phone': customer.phone,
      'Website': customer.website,
      'Type': customer.customerType,
      'Status': customer.status,
      'Priority': customer.priority,
      'Requirements': customer.requirements,
      'Value Tier': customer.valueTier,
      'Direct Import': customer.directImport,
      'Last Follow-up': customer.lastFollowUpDate,
      'Next Follow-up': customer.nextFollowUpDate,
      'Returning Customer': customer.isReturningCustomer ? 'Yes' : 'No',
      'Tags': customer.tags.join(', '),
    }));
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(customersData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create object URL
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `SNK_Surfaces_Customers_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2" 
      onClick={handleExport}
      disabled={customers.length === 0}
    >
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
}