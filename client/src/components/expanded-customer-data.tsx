import { useState } from 'react';
import { Customer, Note } from '@/types/customer';
import { useCustomers } from '@/hooks/use-customers';
import NoteItem from './note-item';
import AddNoteModal from './add-note-modal';
import CustomerActionButtons from './customer-action-buttons';
import EmailLogComponent from './email-log';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpandedCustomerDataProps {
  customer: Customer;
}

export default function ExpandedCustomerData({ customer }: ExpandedCustomerDataProps) {
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const { useCustomerNotes } = useCustomers();
  
  // Fetch notes for this customer
  const { data: notes = [], isLoading: notesLoading } = useCustomerNotes(customer.id);
  
  // Filter key notes
  const keyNotes = notes.filter(note => note.isKey);
  
  const { toggleHotLead, togglePinned } = useCustomers();
  
  const handleToggleHotLead = (id: string) => {
    toggleHotLead(id);
  };
  
  const handleTogglePinned = (id: string) => {
    togglePinned(id);
  };
  
  return (
    <div className="p-6 bg-gray-50 border-t border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-medium text-gray-900">{customer.name}</h3>
        <CustomerActionButtons 
          customer={customer} 
          onToggleHotLead={handleToggleHotLead} 
          onTogglePinned={handleTogglePinned} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="notes">
            <TabsList className="mb-4">
              <TabsTrigger value="notes">All Notes ({notes.length})</TabsTrigger>
              <TabsTrigger value="key-notes">Key Notes ({keyNotes.length})</TabsTrigger>
              <TabsTrigger value="details">Customer Details</TabsTrigger>
              <TabsTrigger value="emails">Email Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Notes</h3>
                <Button 
                  onClick={() => setAddNoteModalOpen(true)}
                  size="sm"
                >
                  Add Note
                </Button>
              </div>
              
              {notesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note: Note) => (
                    <NoteItem key={note.id} note={note} customerId={customer.id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No notes found for this customer.</p>
                  <p className="text-sm mt-1">Add a note to keep track of your interactions.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="key-notes" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Key Notes</h3>
                <Button 
                  onClick={() => setAddNoteModalOpen(true)}
                  size="sm"
                >
                  Add Note
                </Button>
              </div>
              
              {notesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : keyNotes.length > 0 ? (
                <div className="space-y-3">
                  {keyNotes.map((note: Note) => (
                    <NoteItem key={note.id} note={note} customerId={customer.id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No key notes found for this customer.</p>
                  <p className="text-sm mt-1">Mark important notes as key to see them here.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Business Information</h3>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Customer Type</p>
                        <p className="font-medium">{customer.customerType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{customer.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-medium">{customer.priority}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Value Tier</p>
                        <p className="font-medium">{customer.valueTier || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Direct Import</p>
                        <p className="font-medium">{customer.directImport || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Returning Customer</p>
                        <p className="font-medium">{customer.isReturningCustomer ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Requirements</p>
                      <p className="mt-1">{customer.requirements || 'No requirements specified'}</p>
                    </div>
                    
                    {customer.tags && customer.tags.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {customer.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Details</h3>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">{customer.contactPerson}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium truncate">
                          {customer.website ? (
                            <a 
                              href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {customer.website}
                            </a>
                          ) : 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {[customer.city, customer.region, customer.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Last Follow-up</p>
                        <p className="font-medium">
                          {customer.lastFollowUpDate ? 
                            new Date(customer.lastFollowUpDate).toLocaleDateString() : 
                            'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Follow-up</p>
                        <p className="font-medium">
                          {customer.nextFollowUpDate ? 
                            new Date(customer.nextFollowUpDate).toLocaleDateString() : 
                            'Not scheduled'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {(customer.lastContactNotes || customer.keyMeetingPoints) && (
                    <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
                      {customer.lastContactNotes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Last Contact Notes</p>
                          <p className="mt-1">{customer.lastContactNotes}</p>
                        </div>
                      )}
                      
                      {customer.keyMeetingPoints && (
                        <div>
                          <p className="text-sm text-gray-500">Key Meeting Points</p>
                          <p className="mt-1">{customer.keyMeetingPoints}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="emails">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Email Log</h3>
                </div>
                <EmailLogComponent customerId={customer.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AddNoteModal 
        customerId={customer.id}
        isOpen={addNoteModalOpen}
        onClose={() => setAddNoteModalOpen(false)}
      />
    </div>
  );
}