import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Customer } from '@/models/customer';

export async function GET() {
  await connectDB();

  // Total customers
  const totalCustomers = await Customer.countDocuments();

  // Hot leads (priority: high)
  const hotLeads = await Customer.countDocuments({ priority: 'high' });

  // All follow-ups (count of all followUps in all customers)
  const customersWithFollowUps = await Customer.find({ 'followUps.0': { $exists: true } }).select('followUps');
  const followUps = customersWithFollowUps.reduce((acc, customer) => acc + (customer.followUps?.length || 0), 0);

  // Due today (pending followUps with today's date)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dueTodayCustomers = await Customer.find({
    followUps: {
      $elemMatch: {
        date: { $gte: today, $lt: tomorrow },
        status: 'pending',
      },
    },
  }).select('followUps');
  let dueToday = 0;
  for (const customer of dueTodayCustomers) {
    dueToday += (customer.followUps || []).filter((fu: any) => {
      const d = new Date(fu.date);
      return d >= today && d < tomorrow && fu.status === 'pending';
    }).length;
  }

  return NextResponse.json({
    totalCustomers,
    hotLeads,
    followUps,
    dueToday,
  });
} 