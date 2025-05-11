'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface FollowUp {
  _id: string;
  customerId: string;
  customerName: string;
  date: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export default function FollowUpsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [allFollowUps, setAllFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFollowUps = async (date?: Date) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (date) {
        queryParams.append('date', date.toISOString());
      }
      console.log('Fetching follow-ups with params:', queryParams.toString());
      const response = await fetch(`/api/followups?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch follow-ups');
      const data = await response.json();
      console.log('Received follow-ups:', data);
      setAllFollowUps(data);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch follow-ups. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Initial fetch of follow-ups');
    fetchFollowUps();
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const getStatusColor = (status: FollowUp['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  // Get dates that have follow-ups
  const datesWithFollowUps = allFollowUps.map(followUp => new Date(followUp.date));

  // Calendar modifiers
  const modifiers = {
    hasFollowUp: (date: Date) => datesWithFollowUps.some(followUpDate => 
      isSameDay(followUpDate, date)
    ),
  };

  // Calendar modifiers styles
  const modifiersStyles = {
    hasFollowUp: {
      backgroundColor: 'rgb(234 179 8 / 0.2)', // yellow-500 with opacity
      borderRadius: '50%',
    },
  };

  // Filter follow-ups based on selected date
  const filteredFollowUps = selectedDate
    ? allFollowUps.filter(followUp => 
        isSameDay(new Date(followUp.date), selectedDate)
      )
    : allFollowUps;

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Follow-ups</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate 
                  ? `Follow-ups for ${format(selectedDate, 'MMMM d, yyyy')}`
                  : 'All Follow-ups'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : filteredFollowUps.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No follow-ups found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add follow-ups to customers to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFollowUps.map((followUp) => (
                    <div
                      key={followUp._id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{followUp.customerName}</div>
                        <div className="text-sm text-gray-500">{followUp.notes}</div>
                        <div className="text-sm">
                          {format(new Date(followUp.date), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                      <Badge className={getStatusColor(followUp.status)}>
                        {followUp.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 