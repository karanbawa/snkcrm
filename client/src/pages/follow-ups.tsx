import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FollowUpCalendar from '@/components/follow-up-calendar';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

export default function FollowUpsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-ups</h1>
          <p className="mt-1 text-gray-500">Schedule and manage your customer follow-ups</p>
        </div>
        <Button className="w-fit gap-1">
          <PlusIcon className="h-4 w-4" />
          New Follow-up
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <FollowUpCalendar />
        </CardContent>
      </Card>
    </div>
  );
}