import { useState, useEffect } from 'react';
import useCustomerStore from '@/hooks/use-customer-store';
import { 
  CustomerStatus, 
  Priority, 
  CustomerType, 
  Customer 
} from '@/types/customer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import ExportToExcel from '@/components/export-to-excel';

export default function CustomerSearchFilters() {
  const { 
    customers,
    setFilterCountry, 
    setFilterStatus, 
    setFilterPriority, 
    setFilterCustomerType,
    setSearchTerm,
  } = useCustomerStore();

  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);

  // Extract unique countries for the filter dropdown
  useEffect(() => {
    const countrySet = new Set<string>();
    customers.forEach(c => {
      if (c.country) countrySet.add(c.country);
    });
    setUniqueCountries(Array.from(countrySet));
  }, [customers]);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-10"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Country Filter */}
          <Select onValueChange={(value) => setFilterCountry(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select onValueChange={(value) => setFilterStatus(value === "all" ? "" : value as CustomerStatus | "")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Email Sent">Email Sent</SelectItem>
              <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select onValueChange={(value) => setFilterPriority(value === "all" ? "" : value as Priority | "")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* CustomerType Filter */}
          <Select onValueChange={(value) => setFilterCustomerType(value === "all" ? "" : value as CustomerType | "")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Retailer">Retailer</SelectItem>
              <SelectItem value="Distributor">Distributor</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Architect">Architect</SelectItem>
              <SelectItem value="Builder">Builder</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <ExportToExcel />
        </div>
      </div>
    </div>
  );
}
