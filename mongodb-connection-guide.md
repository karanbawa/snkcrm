# MongoDB Atlas Connection Guide

## IP Whitelist Setup

To connect to MongoDB Atlas from Replit, you need to whitelist the IP address(es) that Replit uses:

1. Log in to your MongoDB Atlas account at https://cloud.mongodb.com/
2. Navigate to your project/cluster
3. Click on "Network Access" in the left sidebar
4. Click the "ADD IP ADDRESS" button
5. For development purposes, you can choose to allow access from anywhere:
   - Select "Allow Access from Anywhere" or manually enter `0.0.0.0/0`
   - Add a comment like "Replit Development"
   - Click "Confirm"
6. Wait for the changes to take effect (usually a few minutes)

⚠️ **Security Note**: Allowing access from anywhere (`0.0.0.0/0`) is not recommended for production environments. For a production database, consider:
- Using MongoDB Atlas's Private Endpoint
- Regularly rotating your database credentials
- Setting up specific IP ranges if possible

## Alternative: Use MongoDB Serverless Instance

MongoDB Atlas also offers a "serverless" instance option that doesn't require IP whitelisting. Consider using this for Replit projects where the IP might change.

## Connection String Format

Your MongoDB connection string should look like:
```
mongodb+srv://username:password@cluster0.example.mongodb.net/database_name?retryWrites=true&w=majority
```

Make sure the connection string includes:
- The correct username and password
- The proper cluster address
- The database name you want to connect to
- Any needed query parameters