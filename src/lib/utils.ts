
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Enhanced utility for class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple date formatter
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format datetime with time
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Generate a random ID
export function generateId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

// Check if the device is mobile
export function isMobileDevice(): boolean {
  return window.innerWidth <= 768;
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Convert object to query string
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

// Parse query string to object
export function queryStringToObject(query: string): Record<string, string> {
  if (!query || query === '?') return {};
  
  const queryWithoutQuestionMark = query.startsWith('?') 
    ? query.substring(1) 
    : query;
  
  return queryWithoutQuestionMark
    .split('&')
    .reduce((acc, param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
}
