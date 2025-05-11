import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Customer } from '@/models/customer';

export async function GET() {
  await connectDB();

  // Get recent customers (added or updated)
  const recentCustomers = await Customer.find()
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('name updatedAt createdAt');

  // Get recent follow-ups (flattened from all customers)
  const customersWithFollowUps = await Customer.find({ 'followUps.0': { $exists: true } })
    .select('name followUps')
    .lean();
  let followUpActivities = [];
  for (const customer of customersWithFollowUps) {
    for (const fu of customer.followUps) {
      followUpActivities.push({
        _id: fu._id,
        type: fu.status === 'completed' ? 'completed' : 'followup',
        description: `${fu.status === 'completed' ? 'Completed' : 'Scheduled'} follow-up for ${customer.name}`,
        date: fu.date,
      });
    }
  }
  // Sort follow-ups by date descending and take 10
  followUpActivities = followUpActivities.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  // Merge and sort all activities by date descending, take 10
  const allActivities = [
    ...recentCustomers.map(c => ({
      _id: c._id,
      type: 'customer',
      description: `Customer updated: ${c.name}`,
      date: c.updatedAt || c.createdAt,
    })),
    ...followUpActivities,
  ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return NextResponse.json(allActivities);
} 