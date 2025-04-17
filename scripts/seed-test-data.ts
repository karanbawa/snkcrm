import { db } from '../server/db';
import { customers, notes } from '../shared/schema';
import { v4 as uuidv4 } from 'uuid';

async function seedTestData() {
  try {
    console.log('Seeding test customers data...');
    
    // Sample data for testing
    const testCustomers = [
      {
        id: uuidv4(),
        isReturningCustomer: true,
        name: 'Acme Tile Distributors',
        country: 'United States',
        region: 'California',
        city: 'Los Angeles',
        contactPerson: 'John Smith',
        email: 'john@acmetile.com',
        phone: '+1-555-123-4567',
        website: 'www.acmetile.com',
        customerType: 'Distributor',
        requirements: 'Looking for high-end marble and granite tiles for luxury projects',
        status: 'Won',
        priority: 'High',
        tags: ['Wholesale', 'Luxury', 'Commercial'],
        valueTier: 'Premium',
        directImport: 'Yes',
        lastFollowUpDate: '2023-05-15',
        nextFollowUpDate: '2023-06-01',
        lastContactNotes: 'Discussed new shipment of Italian marble',
        keyMeetingPoints: 'Wants to increase order volume by 20%'
      },
      {
        id: uuidv4(),
        isReturningCustomer: false,
        name: 'Modern Design Studio',
        country: 'Canada',
        region: 'Ontario',
        city: 'Toronto',
        contactPerson: 'Emma Wilson',
        email: 'emma@moderndesign.ca',
        phone: '+1-555-987-6543',
        website: 'www.moderndesign.ca',
        customerType: 'Designer',
        requirements: 'Needs unique patterned tiles for boutique hotel project',
        status: 'Meeting Scheduled',
        priority: 'Medium',
        tags: ['Boutique', 'Hotel', 'Interior'],
        valueTier: 'Standard',
        directImport: 'No',
        lastFollowUpDate: '2023-05-20',
        nextFollowUpDate: '2023-05-30',
        lastContactNotes: 'Sent samples of patterned ceramic tiles',
        keyMeetingPoints: 'Budget constraints, looking for bulk discount'
      },
      {
        id: uuidv4(),
        isReturningCustomer: false,
        name: 'Build Right Construction',
        country: 'United Kingdom',
        region: 'England',
        city: 'London',
        contactPerson: 'Robert Johnson',
        email: 'robert@buildright.co.uk',
        phone: '+44-20-1234-5678',
        website: 'www.buildright.co.uk',
        customerType: 'Contractor',
        requirements: 'Large order of durable floor tiles for commercial building',
        status: 'Negotiation',
        priority: 'High',
        tags: ['Commercial', 'Large Scale', 'Flooring'],
        valueTier: 'Premium',
        directImport: 'Distributor',
        lastFollowUpDate: '2023-05-18',
        nextFollowUpDate: '2023-05-28',
        lastContactNotes: 'Discussing price points for bulk order',
        keyMeetingPoints: 'Need delivery within 3 months'
      },
      {
        id: uuidv4(),
        isReturningCustomer: true,
        name: 'Elite Home Renovations',
        country: 'Australia',
        region: 'New South Wales',
        city: 'Sydney',
        contactPerson: 'Sarah Parker',
        email: 'sarah@elitehome.com.au',
        phone: '+61-2-9876-5432',
        website: 'www.elitehome.com.au',
        customerType: 'Retailer',
        requirements: 'Searching for eco-friendly and sustainable tile options',
        status: 'Email Sent',
        priority: 'Low',
        tags: ['Eco-friendly', 'Residential', 'Renovation'],
        valueTier: 'Standard',
        directImport: 'No',
        lastFollowUpDate: '2023-05-10',
        nextFollowUpDate: '2023-06-10',
        lastContactNotes: 'Sent catalog of sustainable tile options',
        keyMeetingPoints: 'Interested in green certification'
      },
      {
        id: uuidv4(),
        isReturningCustomer: false,
        name: 'Huang & Associates Architecture',
        country: 'Japan',
        region: 'Kanto',
        city: 'Tokyo',
        contactPerson: 'Ken Huang',
        email: 'ken@huangarchitects.jp',
        phone: '+81-3-1234-5678',
        website: 'www.huangarchitects.jp',
        customerType: 'Architect',
        requirements: 'Specialty stone for traditional-modern fusion project',
        status: 'Lead',
        priority: 'Medium',
        tags: ['Cultural', 'Specialty', 'High-end'],
        valueTier: 'Premium',
        directImport: 'Yes',
        lastFollowUpDate: '',
        nextFollowUpDate: '2023-05-31',
        lastContactNotes: 'Initial inquiry about specialty stone options',
        keyMeetingPoints: 'Looking for exclusive materials'
      }
    ];

    // Insert customers
    for (const customer of testCustomers) {
      const customerId = customer.id;
      
      // Insert customer
      await db.insert(customers).values(customer);
      
      // Create sample notes for each customer
      await db.insert(notes).values([
        {
          id: uuidv4(),
          customerId,
          text: `Initial meeting with ${customer.contactPerson}. Discussed requirements and potential products.`,
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          nextStep: 'Send product catalog',
          isKey: true,
          images: []
        },
        {
          id: uuidv4(),
          customerId,
          text: `Followed up about product options. ${customer.contactPerson} expressed interest in our premium line.`,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          nextStep: 'Prepare price quote',
          isKey: false,
          images: []
        }
      ]);
    }
    
    console.log('Successfully added 5 test customers with notes!');
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    process.exit(0);
  }
}

seedTestData();