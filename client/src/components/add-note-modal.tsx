import { useState, useRef } from 'react';
import useCustomerStore from '@/hooks/use-customer-store';
import { Note } from '@/types/customer';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AddNoteModalProps {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNoteModal({ customerId, isOpen, onClose }: AddNoteModalProps) {
  const { addNote } = useCustomerStore();
  const { toast } = useToast();
  
  const [noteText, setNoteText] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [isKey, setIsKey] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    if (!noteText.trim()) {
      toast({
        title: "Note Text Required",
        description: "Please enter some text for your note.",
        variant: "destructive",
      });
      return;
    }
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: noteText,
      timestamp: new Date().toISOString(),
      nextStep,
      isKey,
      images,
    };
    
    addNote(customerId, newNote);
    
    toast({
      title: "Note Added",
      description: "Your note has been added successfully.",
    });
    
    onClose();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    processImageFiles(files);
  };
  
  const processImageFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please select only image files (.jpg, .png, .gif, etc.).",
        variant: "destructive",
      });
      return;
    }
    
    const newImages: string[] = [];
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          newImages.push(event.target.result);
          
          // If all files are processed, update the state
          if (newImages.length === imageFiles.length) {
            setImages(prev => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      processImageFiles(files);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>
            Add a note about your interaction with this customer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="note-text">Note <span className="text-red-500">*</span></Label>
            <Textarea
              id="note-text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter details about your interaction..."
              rows={4}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="next-step">Next Step</Label>
            <Input
              id="next-step"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="What's the next action to take?"
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="is-key" className="flex-grow">Mark as Key Note</Label>
            <Switch
              id="is-key"
              checked={isKey}
              onCheckedChange={setIsKey}
            />
          </div>
          
          <div>
            <Label className="block mb-1">Images</Label>
            <div
              className={`border-2 border-dashed rounded-md p-4 text-center ${
                isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">
                  Drag & drop images here, or 
                  <button 
                    type="button"
                    className="text-primary-600 hover:text-primary-700 mx-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4">
                <Label className="block mb-2">Uploaded Images ({images.length})</Label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Uploaded ${index + 1}`} 
                        className="w-full h-16 object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
