import { useState } from 'react';
import { Customer, Note } from '@/types/customer';
import NoteItem from '@/components/note-item';
import AddNoteModal from '@/components/add-note-modal';

interface ExpandedCustomerDataProps {
  customer: Customer;
}

export default function ExpandedCustomerData({ customer }: ExpandedCustomerDataProps) {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  
  return (
    <div className="bg-gray-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Contact Details</h4>
          <div className="text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg> 
            {customer.phone || 'N/A'}
          </div>
          <div className="text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
            </svg> 
            {customer.website ? (
              <a 
                href={customer.website.startsWith('http') ? customer.website : `http://${customer.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {customer.website}
              </a>
            ) : 'N/A'}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Business Details</h4>
          <div className="text-sm mb-2"><strong>Value Tier:</strong> {customer.valueTier || 'N/A'}</div>
          <div className="text-sm mb-2"><strong>Direct Import:</strong> {customer.directImport || 'N/A'}</div>
          
          {customer.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {customer.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="tag-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Follow-up Information</h4>
          <div className="text-sm mb-2">
            <strong>Last Follow-up:</strong> {customer.lastFollowUpDate ? new Date(customer.lastFollowUpDate).toLocaleDateString() : 'N/A'}
          </div>
          <div className="text-sm mb-2">
            <strong>Next Follow-up:</strong> {customer.nextFollowUpDate ? new Date(customer.nextFollowUpDate).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Requirements</h4>
          <p className="text-sm text-gray-700">{customer.requirements || 'No requirements specified.'}</p>
        </div>
      </div>
      
      {/* Notes Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Notes & Communications</h4>
          <button 
            onClick={() => setIsAddNoteModalOpen(true)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Note
          </button>
        </div>
        
        <div className="space-y-3">
          {customer.notes && customer.notes.length > 0 ? (
            customer.notes.map((note: Note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                customerId={customer.id} 
              />
            ))
          ) : (
            <div className="bg-white rounded-md p-3 border border-gray-200 text-sm text-gray-500">
              No notes yet. Add a note to keep track of your communications with this customer.
            </div>
          )}
        </div>
      </div>
      
      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
        <AddNoteModal 
          customerId={customer.id}
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
        />
      )}
    </div>
  );
}
