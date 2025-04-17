import { useState } from 'react';
import { Note } from '@/types/customer';
import { useCustomers } from '@/hooks/use-customers';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoteItemProps {
  note: Note;
  customerId: string;
}

export default function NoteItem({ note, customerId }: NoteItemProps) {
  const { toggleKeyNote, deleteNote } = useCustomers();
  const { toast } = useToast();
  const [showImages, setShowImages] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const formattedDate = new Date(note.timestamp).toLocaleDateString();
  
  const handleToggleKey = () => {
    toggleKeyNote(customerId, note.id);
    // Toast is now handled by the mutation in useCustomers
  };
  
  const handleDelete = () => {
    deleteNote(customerId, note.id);
    // Toast is now handled by the mutation in useCustomers
    setShowDeleteDialog(false);
  };
  
  return (
    <div className={`bg-white rounded-lg p-4 border shadow-sm ${note.isKey ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {note.isKey && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mr-2">
              Key
            </span>
          )}
          <p className="text-sm text-gray-800 leading-relaxed">{note.text}</p>
        </div>
        <div className="text-xs text-gray-500 font-medium">{formattedDate}</div>
      </div>
      
      {note.nextStep && (
        <div className="mt-3 bg-gray-50 p-2 rounded-md border border-gray-100">
          <div className="text-xs text-gray-600"><span className="font-semibold">Next Step:</span> {note.nextStep}</div>
        </div>
      )}
      
      {note.images && note.images.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowImages(!showImages)}
            className="text-xs text-primary hover:text-primary/80 flex items-center font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            {showImages ? 'Hide' : 'Show'} {note.images.length} {note.images.length === 1 ? 'image' : 'images'}
          </button>
          
          {showImages && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {note.images.map((image: string, index: number) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Attachment ${index + 1}`} 
                    className="w-full h-24 object-cover rounded border border-gray-200"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end space-x-3">
        <button
          onClick={handleToggleKey}
          className="text-xs text-gray-500 hover:text-amber-500 transition-colors"
          title={note.isKey ? "Remove key highlight" : "Mark as key"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${note.isKey ? 'text-amber-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
