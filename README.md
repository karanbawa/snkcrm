# SNK CRM

A modern Customer Relationship Management system built with Next.js, TypeScript, and MongoDB.

## Features

- Modern UI with Tailwind CSS and Radix UI components
- Type-safe development with TypeScript
- MongoDB database integration
- Next.js 14 with App Router
- Authentication with NextAuth.js
- Form handling with React Hook Form and Zod validation

## Prerequisites

- Node.js 18.17 or later
- MongoDB database
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd snk-crm
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication routes
│   └── (dashboard)/    # Dashboard routes
├── components/         # React components
├── lib/               # Utility functions and configurations
├── models/            # MongoDB models
└── types/             # TypeScript type definitions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 