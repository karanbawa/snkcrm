import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCustomers } from '@/hooks/use-customers';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChartIcon, 
  ChatBubbleIcon, 
  PersonIcon, 
  CalendarIcon, 
  PlusIcon,
  RocketIcon,
  MagnifyingGlassIcon,
  InfoCircledIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons';
import ActivityFeed from '@/components/activity-feed';
import { useToast } from '@/hooks/use-toast';
import AddCustomerModal from '@/components/add-customer-modal';
import AddFollowupModal from '@/components/add-followup-modal';

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { customers, isLoading } = useCustomers();
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddFollowupOpen, setIsAddFollowupOpen] = useState(false);
  
  const customerCount = customers.length;
  const hotLeads = customers.filter(c => c.isHotLead).length;
  const followUps = customers.filter(c => c.nextFollowUpDate).length;
  
  // Format today's date for comparison
  const today = new Date().toISOString().split('T')[0];
  const followUpsDue = customers.filter(customer => {
    return customer.nextFollowUpDate && customer.nextFollowUpDate.startsWith(today);
  }).length;

  const statCards = [
    {
      title: 'Total Customers',
      value: customerCount,
      description: 'All customers in your database',
      icon: <PersonIcon className="h-5 w-5" />,
      color: 'bg-blue-500',
      link: '/customers'
    },
    {
      title: 'Hot Leads',
      value: hotLeads,
      description: 'Marked as high priority',
      icon: <BarChartIcon className="h-5 w-5" />,
      color: 'bg-red-500',
      link: '/customers?hot=true'
    },
    {
      title: 'Follow-ups',
      value: followUps,
      description: 'Scheduled follow-ups',
      icon: <CalendarIcon className="h-5 w-5" />,
      color: 'bg-emerald-500',
      link: '/follow-ups'
    },
    {
      title: 'Due Today',
      value: followUpsDue,
      description: 'Tasks to complete today',
      icon: <ChatBubbleIcon className="h-5 w-5" />,
      color: 'bg-amber-500',
      link: '/follow-ups?today=true'
    }
  ];

  const quickActions = [
    {
      title: 'Add Customer',
      description: 'Create a new customer record',
      icon: <PersonIcon className="h-5 w-5" />,
      onClick: () => setIsAddCustomerOpen(true)
    },
    {
      title: 'Schedule Follow-up',
      description: 'Set a reminder for follow-up',
      icon: <CalendarIcon className="h-5 w-5" />,
      onClick: () => setIsAddFollowupOpen(true)
    },
    {
      title: 'Add Note',
      description: 'Add a note to an existing customer',
      icon: <ChatBubbleIcon className="h-5 w-5" />,
      onClick: () => navigate('/customers')
    },
    {
      title: 'Export Data',
      description: 'Export your customer data',
      icon: <CheckCircledIcon className="h-5 w-5" />,
      onClick: () => navigate('/customers')
    },
  ];

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome to your SNK Surfaces CRM dashboard</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="overflow-hidden shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.color} rounded-full p-1.5 text-white shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={stat.link} className="text-sm font-medium text-primary hover:underline">
                  View all
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest interactions with your customers</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ActivityFeed />
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {quickActions.map((action) => (
                <button 
                  key={action.title} 
                  onClick={action.onClick}
                  className="flex w-full items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100">
              <Button className="w-full" variant="outline">
                <PlusIcon className="mr-2 h-4 w-4" />
                View More Actions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Customer and Follow-up Modals */}
      {isAddCustomerOpen && (
        <AddCustomerModal 
          isOpen={isAddCustomerOpen}
          onClose={() => setIsAddCustomerOpen(false)}
        />
      )}
      
      {isAddFollowupOpen && (
        <AddFollowupModal
          isOpen={isAddFollowupOpen}
          onClose={() => setIsAddFollowupOpen(false)}
        />
      )}
    </>
  );
}