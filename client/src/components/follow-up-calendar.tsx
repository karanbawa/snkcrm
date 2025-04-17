import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Customer } from '@/types/customer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useCustomers } from '@/hooks/use-customers';
import { Loader2 } from 'lucide-react';

export default function FollowUpCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [followUps, setFollowUps] = useState<{[key: string]: Customer[]}>({});
  const { customers, isLoading } = useCustomers();
  
  useEffect(() => {
    if (!customers) return;
    
    // Group customers by follow-up date
    const groupedFollowUps: {[key: string]: Customer[]} = {};
    customers.forEach(customer => {
      if (!customer.nextFollowUpDate) return;
      
      if (!groupedFollowUps[customer.nextFollowUpDate]) {
        groupedFollowUps[customer.nextFollowUpDate] = [];
      }
      
      groupedFollowUps[customer.nextFollowUpDate].push(customer);
    });
    
    setFollowUps(groupedFollowUps);
  }, [customers]);
  
  // Function to render customer list for the selected date
  const renderCustomersForDate = (date: Date | undefined) => {
    if (!date) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const customersForDate = followUps[dateStr] || [];
    
    if (customersForDate.length === 0) {
      return (
        <div className="py-4 text-center text-gray-500">
          No follow-ups scheduled for this date
        </div>
      );
    }
    
    return (
      <div className="space-y-3 mt-3">
        {customersForDate.map(customer => (
          <Card key={customer.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium mb-1">{customer.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{customer.contactPerson} • {customer.email}</p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getStatusVariant(customer.status)}>
                      {customer.status}
                    </Badge>
                    <Badge variant={getPriorityVariant(customer.priority)}>
                      {customer.priority} Priority
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Function to get the color scheme for follow-up dates
  const getFollowUpClass = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const dateStr = date.toISOString().split('T')[0];
    
    // If there's no follow-up on this date, return empty string
    if (!followUps[dateStr]) return '';
    
    // If the date is before today, it's overdue
    if (date < today) return 'follow-up-overdue';
    
    // If the date is within next 7 days, it's due soon
    if (date < nextWeek) return 'follow-up-soon';
    
    // Otherwise, it's a future follow-up
    return 'follow-up-future';
  };
  
  // Helper function to get status variant color
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Won":
        return "default";
      case "Lead":
      case "Email Sent":
      case "Meeting Scheduled":
        return "secondary";
      case "Lost":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  // Helper function to get priority variant color
  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <style jsx global>{`
        .follow-up-overdue .day-highlighted {
          background-color: rgba(239, 68, 68, 0.2) !important;
          color: rgb(239, 68, 68) !important;
          font-weight: bold;
        }
        
        .follow-up-soon .day-highlighted {
          background-color: rgba(245, 158, 11, 0.2) !important;
          color: rgb(245, 158, 11) !important;
          font-weight: bold;
        }
        
        .follow-up-future .day-highlighted {
          background-color: rgba(16, 185, 129, 0.2) !important;
          color: rgb(16, 185, 129) !important;
          font-weight: bold;
        }
      `}</style>
      
      <Card className="col-span-1 md:col-span-3">
        <CardHeader>
          <CardTitle>Follow-up Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiersClassNames={{
              selected: 'bg-primary text-primary-foreground',
            }}
            classNames={{
              day_today: 'bg-accent text-accent-foreground',
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            }}
            components={{
              DayContent: ({ date, ...props }) => {
                const followUpClass = getFollowUpClass(date);
                return (
                  <div className={followUpClass}>
                    <div {...props} className="day-highlighted">
                      {date.getDate()}
                    </div>
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>
            Follow-ups for {date ? formatDate(date.toISOString()) : 'Selected Date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCustomersForDate(date)}
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Follow-up Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm">Overdue</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              <span className="text-sm">Due this week</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm">Future follow-ups</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}