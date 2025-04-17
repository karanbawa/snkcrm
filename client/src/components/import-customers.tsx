import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/use-customers';
import { Customer } from '@/types/customer';
import { Upload, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function ImportCustomers() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { addCustomer } = useCustomers();
  
  const resetState = () => {
    setFile(null);
    setPreview([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreview([]);
    
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = files[0];
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExt !== 'xlsx' && fileExt !== 'xls' && fileExt !== 'csv') {
      setError('Please upload a valid Excel or CSV file');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    
    // Preview the file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          setError('The file does not contain enough data. Please make sure it has headers and at least one data row.');
          return;
        }
        
        // Display first 5 rows as preview
        setPreview(jsonData.slice(0, 5));
      } catch (err) {
        console.error('Error parsing file:', err);
        setError('Error parsing file. Please check the file format.');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    
    reader.readAsBinaryString(selectedFile);
  };
  
  const processFile = async () => {
    if (!file) return;
    
    setImporting(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            setError('No data found in the file.');
            setImporting(false);
            return;
          }
          
          // Import customers one by one
          let importedCount = 0;
          let errorCount = 0;
          
          for (const row of jsonData) {
            try {
              // Map the imported data to our customer schema
              const rowData = row as Record<string, any>;
              const customer: Partial<Customer> = {
                id: uuidv4(),
                name: rowData.name || rowData.Name || rowData.company || rowData.Company || '',
                contactPerson: rowData.contactPerson || rowData.contact || rowData.contact_person || rowData.Contact || '',
                email: rowData.email || rowData.Email || '',
                phone: rowData.phone || rowData.Phone || '',
                country: rowData.country || rowData.Country || '',
                region: rowData.region || rowData.Region || '',
                city: rowData.city || rowData.City || '',
                website: rowData.website || rowData.Website || '',
                customerType: mapCustomerType(rowData.customerType || rowData.customer_type || rowData.type || ''),
                requirements: rowData.requirements || rowData.Requirements || '',
                status: mapStatus(rowData.status || rowData.Status || ''),
                priority: mapPriority(rowData.priority || rowData.Priority || ''),
                tags: mapTags(rowData.tags || rowData.Tags || ''),
                isReturningCustomer: Boolean(rowData.isReturningCustomer || rowData.returning || false),
                valueTier: mapValueTier(rowData.valueTier || rowData.value_tier || ''),
                directImport: mapDirectImport(rowData.directImport || rowData.direct_import || ''),
                lastFollowUpDate: rowData.lastFollowUpDate || rowData.last_follow_up || '',
                nextFollowUpDate: rowData.nextFollowUpDate || rowData.next_follow_up || '',
                lastContactNotes: rowData.lastContactNotes || rowData.last_contact_notes || '',
                keyMeetingPoints: rowData.keyMeetingPoints || rowData.key_meeting_points || '',
                isHotLead: Boolean(rowData.isHotLead || rowData.hot_lead || false),
                isPinned: Boolean(rowData.isPinned || rowData.pinned || false),
              };
              
              // Add the customer
              await addCustomer(customer as Omit<Customer, 'id'>);
              importedCount++;
            } catch (err) {
              console.error('Error importing customer:', err);
              errorCount++;
            }
          }
          
          toast({
            title: 'Import Completed',
            description: `Successfully imported ${importedCount} customers. ${errorCount > 0 ? `Failed to import ${errorCount} customers.` : ''}`,
          });
          
          setIsOpen(false);
          resetState();
        } catch (err) {
          console.error('Error processing file:', err);
          setError('Error processing file. Please check the file format.');
        }
        
        setImporting(false);
      };
      
      reader.onerror = () => {
        setError('Error reading file. Please try again.');
        setImporting(false);
      };
      
      reader.readAsBinaryString(file);
    } catch (err) {
      console.error('Error importing data:', err);
      setError('An unexpected error occurred during import.');
      setImporting(false);
    }
  };
  
  // Helper functions to map values to our schema
  const mapCustomerType = (type: string): any => {
    const typeMap: {[key: string]: any} = {
      'retailer': 'Retailer',
      'distributor': 'Distributor',
      'contractor': 'Contractor',
      'designer': 'Designer',
      'architect': 'Architect',
      'builder': 'Builder',
    };
    
    return typeMap[type.toLowerCase()] || 'Other';
  };
  
  const mapStatus = (status: string): any => {
    const statusMap: {[key: string]: any} = {
      'lead': 'Lead',
      'email sent': 'Email Sent',
      'meeting scheduled': 'Meeting Scheduled',
      'negotiation': 'Negotiation',
      'won': 'Won',
      'lost': 'Lost',
    };
    
    return statusMap[status.toLowerCase()] || 'Lead';
  };
  
  const mapPriority = (priority: string): any => {
    const priorityMap: {[key: string]: any} = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low',
    };
    
    return priorityMap[priority.toLowerCase()] || 'Medium';
  };
  
  const mapTags = (tags: string): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    
    // Try to parse as comma-separated string
    return tags.split(',').map(tag => tag.trim());
  };
  
  const mapValueTier = (tier: string): any => {
    const tierMap: {[key: string]: any} = {
      'premium': 'Premium',
      'standard': 'Standard',
      'basic': 'Basic',
    };
    
    return tierMap[tier.toLowerCase()] || 'Standard';
  };
  
  const mapDirectImport = (status: string): any => {
    const importMap: {[key: string]: any} = {
      'yes': 'Yes',
      'no': 'No',
      'distributor': 'Distributor',
    };
    
    return importMap[status.toLowerCase()] || 'No';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => resetState()}
          id="import-data-trigger"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Import Data</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Customer Data</DialogTitle>
          <DialogDescription>
            Upload an Excel (XLSX/XLS) or CSV file with your customer data.
            Make sure column names match our field names or common alternatives.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90"
            />
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {preview.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Preview (first 5 rows):</h3>
              <div className="max-h-64 overflow-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {preview[0].map((cell: any, idx: number) => (
                        <th 
                          key={idx}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(1).map((row: any, rowIdx: number) => (
                      <tr key={rowIdx}>
                        {row.map((cell: any, cellIdx: number) => (
                          <td key={cellIdx} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            <p className="mb-1 font-medium">Field Mapping:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">name/Name/company/Company:</span> Customer name</li>
              <li><span className="font-medium">contactPerson/contact/Contact:</span> Contact person</li>
              <li><span className="font-medium">email/Email, phone/Phone:</span> Contact details</li>
              <li><span className="font-medium">status/Status:</span> Lead, Email Sent, Meeting Scheduled, Negotiation, Won, Lost</li>
              <li><span className="font-medium">priority/Priority:</span> High, Medium, Low</li>
              <li><span className="font-medium">tags/Tags:</span> Comma-separated list of tags</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={importing}
          >
            Cancel
          </Button>
          <Button
            onClick={processFile}
            disabled={!file || importing}
            className="gap-2"
          >
            {importing ? (
              <>
                <Upload className="h-4 w-4 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}