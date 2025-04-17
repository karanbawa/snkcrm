import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  
  const addTag = () => {
    const trimmedInput = inputValue.trim();
    
    if (trimmedInput && !tags.includes(trimmedInput)) {
      setTags([...tags, trimmedInput]);
      setInputValue('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="tag-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            {tag}
            <button 
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      
      <div className="flex">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="rounded-r-none"
        />
        <Button 
          type="button" 
          onClick={addTag}
          variant="secondary"
          className="rounded-l-none border border-l-0 border-input"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
