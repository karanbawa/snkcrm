import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Add a tag...",
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() === "" || value.length >= maxTags) return;
    
    // Don't add duplicate tags
    if (!value.includes(inputValue.trim())) {
      const newTags = [...value, inputValue.trim()];
      onChange(newTags);
    }
    
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove the last tag when pressing backspace with an empty input
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200 py-1"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="rounded-r-none"
        />
        <Button
          type="button"
          onClick={handleAddTag}
          className="rounded-l-none"
          disabled={inputValue.trim() === "" || value.length >= maxTags}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {value.length >= maxTags && (
        <p className="text-xs text-gray-500">Maximum number of tags reached.</p>
      )}
    </div>
  );
}
