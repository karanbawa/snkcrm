import { Link } from 'wouter';
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
import { 
  BarChartIcon, 
  ChatBubbleIcon, 
  PersonIcon, 
  CalendarIcon, 
  PlusIcon 
} from '@radix-ui/react-icons';
import ActivityFeed from '@/components/activity-feed';

export default function Dashboard() {
  const { customers, isLoading } = useCustomers();
  
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
      action: '/customers/new'
    },
    {
      title: 'Schedule Follow-up',
      description: 'Set a reminder for follow-up',
      icon: <CalendarIcon className="h-5 w-5" />,
      action: '/follow-ups/new'
    },
    {
      title: 'Add Note',
      description: 'Write a new note',
      icon: <ChatBubbleIcon className="h-5 w-5" />,
      action: '/notes/new'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome to your SNK Surfaces CRM dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} rounded-full p-1.5 text-white`}>
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interactions with your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link 
                key={action.title} 
                href={action.action} 
                className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
              >
                <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <PlusIcon className="mr-2 h-4 w-4" />
              View More Actions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}