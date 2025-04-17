import { useCustomers } from '@/hooks/use-customers';
import { CustomerStatus, CustomerType, Priority } from '@/types/customer';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

export default function CustomerSearchFilters() {
  const { filters, setFilter, resetFilters, customers } = useCustomers();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Get unique countries from customers for dropdown
  const countrySet = new Set<string>();
  customers.forEach(customer => {
    if (customer.country) countrySet.add(customer.country);
  });
  const uniqueCountries = Array.from(countrySet).sort();
  
  // Check if any filters are applied
  const hasActiveFilters = 
    !!filters.search || 
    !!filters.country || 
    !!filters.status || 
    !!filters.priority || 
    !!filters.customerType;
  
  return (
    <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      {/* Search bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by name, tags or requirements..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-9 pr-10 h-10"
          />
          {filters.search && (
            <button 
              onClick={() => setFilter('search', '')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          variant="outline" 
          className="gap-2 flex-none h-10"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {(!!filters.country ? 1 : 0) + 
               (!!filters.status ? 1 : 0) + 
               (!!filters.priority ? 1 : 0) + 
               (!!filters.customerType ? 1 : 0)}
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            className="text-sm text-gray-600 hover:text-gray-900 h-10 flex-none"
            onClick={resetFilters}
          >
            Clear all
          </Button>
        )}
      </div>
      
      {/* Filter options */}
      {isFilterExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-200">
          <div>
            <Label htmlFor="country-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Country
            </Label>
            <Select value={filters.country} onValueChange={(value) => setFilter('country', value)}>
              <SelectTrigger id="country-filter" className="h-10">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All countries</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </Label>
            <Select value={filters.status} onValueChange={(value) => setFilter('status', value)}>
              <SelectTrigger id="status-filter" className="h-10">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Email Sent">Email Sent</SelectItem>
                <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </Label>
            <Select value={filters.priority} onValueChange={(value) => setFilter('priority', value)}>
              <SelectTrigger id="priority-filter" className="h-10">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Customer Type
            </Label>
            <Select value={filters.customerType} onValueChange={(value) => setFilter('customerType', value)}>
              <SelectTrigger id="type-filter" className="h-10">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="Retailer">Retailer</SelectItem>
                <SelectItem value="Distributor">Distributor</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Architect">Architect</SelectItem>
                <SelectItem value="Builder">Builder</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}