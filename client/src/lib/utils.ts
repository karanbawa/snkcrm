import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to YYYY-MM-DD for HTML date inputs
export function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Format date to a more readable format
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
