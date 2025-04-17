import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { filterOptions } from "@/lib/utils";
import { Search, Download } from "lucide-react";
import { exportToExcel } from "@/lib/ExportToExcel";
import { Customer } from "@shared/schema";

interface CustomerFilterProps {
  onFilterChange: (key: string, value: string) => void;
  customers: Customer[];
}

export function CustomerFilter({ onFilterChange, customers }: CustomerFilterProps) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange("search", value);
  };

  const handleSelectChange = (key: string, value: string) => {
    onFilterChange(key, value);
  };

  const handleExport = () => {
    exportToExcel(customers, "SNK_Surfaces_Customers");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-10"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select 
            onValueChange={(value) => handleSelectChange("country", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {filterOptions.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {filterOptions.statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            onValueChange={(value) => handleSelectChange("priority", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              {filterOptions.priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            onValueChange={(value) => handleSelectChange("customerType", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {filterOptions.customerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
