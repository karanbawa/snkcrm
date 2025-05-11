"use client"

import Layout from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, User, FileText, Search, BarChart, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddCustomerModal from '@/components/add-customer-modal';
import Link from 'next/link';

interface DashboardStats {
  totalCustomers: number;
  hotLeads: number;
  followUps: number;
  dueToday: number;
}

interface ActivityItem {
  _id: string;
  type: string;
  description: string;
  date: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      const statsRes = await fetch('/api/dashboard/stats');
      const activityRes = await fetch('/api/dashboard/activity');
      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      setStats(statsData);
      setActivity(activityData);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <User className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats ? stats.totalCustomers : '--'}</div>
              <Link href="/customers" className="text-xs text-muted-foreground hover:underline">View all</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
              <BarChart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats ? stats.hotLeads : '--'}</div>
              <Link href="/customers?priority=high" className="text-xs text-muted-foreground hover:underline">View all</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
              <Calendar className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats ? stats.followUps : '--'}</div>
              <Link href="/followups" className="text-xs text-muted-foreground hover:underline">View all</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats ? stats.dueToday : '--'}</div>
              <Link href="/tasks?due=today" className="text-xs text-muted-foreground hover:underline">View all</Link>
            </CardContent>
          </Card>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <AddCustomerModal>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
              </AddCustomerModal>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/import"><FileText className="mr-2 h-4 w-4" /> Import Data</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/followups"><Calendar className="mr-2 h-4 w-4" /> Schedule Follow-up</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/search"><Search className="mr-2 h-4 w-4" /> Search</Link>
              </Button>
            </CardContent>
          </Card>
          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : activity.length === 0 ? (
                <div className="text-muted-foreground">No activities to display</div>
              ) : (
                <ul className="divide-y">
                  {activity.map(item => (
                    <li key={item._id} className="py-2 flex items-center gap-2">
                      {item.type === 'followup' && <Calendar className="h-4 w-4 text-green-500" />}
                      {item.type === 'customer' && <User className="h-4 w-4 text-blue-500" />}
                      {item.type === 'lead' && <BarChart className="h-4 w-4 text-red-500" />}
                      {item.type === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      <span className="text-sm">{item.description}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 