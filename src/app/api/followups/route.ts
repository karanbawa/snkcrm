import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Customer } from '@/models/customer';

interface FollowUp {
  _id: string;
  date: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface CustomerDocument {
  _id: string;
  name: string;
  followUps: FollowUp[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    await connectToDatabase();

    const query: any = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query['followUps.date'] = {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      };
    }

    const customers = await Customer.find(query).select('name followUps');
    console.log('Found customers:', customers.length);
    
    if (customers.length > 0) {
      console.log('Sample customer follow-ups:', customers[0].followUps);
    }

    const followUps = customers.flatMap((customer: CustomerDocument) => 
      customer.followUps.map((followUp: FollowUp) => ({
        _id: followUp._id,
        customerId: customer._id,
        customerName: customer.name,
        date: followUp.date,
        notes: followUp.notes,
        status: followUp.status,
      }))
    );

    console.log('Total follow-ups found:', followUps.length);

    return NextResponse.json(followUps);
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch follow-ups' },
      { status: 500 }
    );
  }
} 