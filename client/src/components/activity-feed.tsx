import { useState, useEffect } from 'react';
import { ActivityLog } from '@/shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { 
  MessageSquare, Mail, Star, Bookmark, FileEdit, AlertTriangle, 
  CheckCircle, Clock, RefreshCw, Loader2
} from 'lucide-react';

interface ActivityFeedProps {
  customerId?: string; // Optional: if provided, shows activities only for this customer
}

export default function ActivityFeed({ customerId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  // Fetch activity logs
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        let url = '/api/activity-logs';
        if (customerId) {
          url = `/api/customers/${customerId}/activity-logs`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [customerId]);
  
  // Filter activities
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.action.toLowerCase().includes(filter.toLowerCase()));
  
  // Icon for activity type
  const getActivityIcon = (action: string) => {
    if (action.includes('Note')) return <MessageSquare className="h-5 w-5 text-blue-500" />;
    if (action.includes('Email')) return <Mail className="h-5 w-5 text-purple-500" />;
    if (action.includes('Hot Lead')) return <Star className="h-5 w-5 text-amber-500" />;
    if (action.includes('Pinned')) return <Bookmark className="h-5 w-5 text-red-500" />;
    if (action.includes('Updated') || action.includes('Edited')) return <FileEdit className="h-5 w-5 text-green-500" />;
    if (action.includes('Attention')) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (action.includes('Status')) {
      if (action.includes('Won')) return <CheckCircle className="h-5 w-5 text-green-500" />;
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    }
    if (action.includes('Follow-up')) return <Clock className="h-5 w-5 text-teal-500" />;
    
    return <MessageSquare className="h-5 w-5 text-gray-500" />;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Activity Feed</CardTitle>
          
          <div className="flex">
            <select 
              className="bg-transparent text-sm border rounded px-2 py-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="note">Notes</option>
              <option value="email">Emails</option>
              <option value="hot">Hot Leads</option>
              <option value="status">Status Changes</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No activities to display</div>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="relative pl-8">
                  <div className="absolute left-0 p-1 bg-white rounded-full z-10">
                    {getActivityIcon(activity.action)}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">{activity.action}</h4>
                        <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <time className="text-xs text-gray-500">
                        {formatDate(activity.timestamp.toString())}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}