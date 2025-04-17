import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FollowUpCalendar from '@/components/follow-up-calendar';
import AddFollowupModal from '@/components/add-followup-modal';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

export default function FollowUpsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-ups</h1>
          <p className="mt-1 text-gray-500">Schedule and manage your customer follow-ups</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-fit gap-1 shadow-sm"
        >
          <PlusIcon className="h-4 w-4" />
          New Follow-up
        </Button>
      </div>
      
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle>Follow-up Calendar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <FollowUpCalendar />
        </CardContent>
      </Card>
      
      {/* Add Follow-up Modal */}
      {isAddModalOpen && (
        <AddFollowupModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}