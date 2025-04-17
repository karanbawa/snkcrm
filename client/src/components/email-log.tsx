import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmailLog } from '@/shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Mail, Trash2, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmailLogProps {
  customerId: string;
}

export default function EmailLogComponent({ customerId }: EmailLogProps) {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');
  
  const { toast } = useToast();
  
  // Fetch email logs
  useEffect(() => {
    const fetchEmailLogs = async () => {
      if (!customerId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/customers/${customerId}/email-logs`);
        if (response.ok) {
          const data = await response.json();
          setEmailLogs(data);
        } else {
          console.error('Failed to fetch email logs');
        }
      } catch (error) {
        console.error('Error fetching email logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmailLogs();
  }, [customerId]);
  
  const handleAddEmail = async () => {
    if (!subject.trim() || !summary.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/customers/${customerId}/email-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: uuidv4(),
          subject,
          summary,
        }),
      });
      
      if (response.ok) {
        const newEmailLog = await response.json();
        setEmailLogs([newEmailLog, ...emailLogs]);
        setIsModalOpen(false);
        
        // Reset form
        setSubject('');
        setSummary('');
        
        toast({
          title: 'Email Logged',
          description: 'Email interaction has been logged successfully',
        });
      } else {
        throw new Error('Failed to create email log');
      }
    } catch (error) {
      console.error('Error adding email log:', error);
      toast({
        title: 'Error',
        description: 'Failed to log email interaction',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteEmailLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email log?')) return;
    
    try {
      const response = await fetch(`/api/email-logs/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEmailLogs(emailLogs.filter(log => log.id !== id));
        
        toast({
          title: 'Email Log Deleted',
          description: 'Email log has been deleted successfully',
        });
      } else {
        throw new Error('Failed to delete email log');
      }
    } catch (error) {
      console.error('Error deleting email log:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete email log',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Email Communication Log</CardTitle>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                <Plus className="h-4 w-4 mr-1" /> Log Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Email Interaction</DialogTitle>
                <DialogDescription>
                  Record details about an email sent to or received from this customer.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Product Quote Request"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary / Next Steps</Label>
                  <Textarea 
                    id="summary" 
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief summary and any follow-up actions needed"
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddEmail}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Email Log'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : emailLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mail className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No email logs recorded yet</p>
            <p className="text-sm">Log your email communications to keep track of customer interactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emailLogs.map((log) => (
              <div key={log.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{log.subject}</h4>
                    <time className="text-xs text-gray-500">
                      {formatDate(log.date.toString())}
                    </time>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEmailLog(log.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-600">{log.summary}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}