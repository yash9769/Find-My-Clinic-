# Find My Clinic - Healthcare Queue Management Platform

A modern healthcare queue management system that revolutionizes clinic visits by providing digital queue management, real-time wait times, and seamless patient-clinic interaction.

## 🚀 Features

### For Patients
- **Clinic Discovery**: Find nearby clinics with real-time availability
- **Digital Queue Management**: Join queues remotely and receive notifications
- **QR Code Integration**: Easy check-in with QR codes
- **Real-time Updates**: Live wait time tracking and status updates
- **Multi-platform Access**: Web app with WhatsApp/SMS fallback

### For Clinics
- **Admin Dashboard**: Comprehensive queue management interface
- **WhatsApp Bot Integration**: Manage queues via WhatsApp messaging
- **Real-time Analytics**: Monitor patient flow and wait times
- **QR Standees**: Physical QR codes for in-clinic check-in
- **Lite Mode**: SMS/WhatsApp integration for clinics with limited tech infrastructure

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom design system
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints with middleware
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL storage

### Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Hosting**: Neon serverless PostgreSQL
- **Migrations**: Drizzle Kit for schema management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon serverless)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/clinic-finder.git
   cd clinic-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. **Database setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-session-secret
NODE_ENV=development
PORT=3000
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🗂️ Project Structure

```
clinic-finder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schemas
└── package.json          # Dependencies and scripts
```

## 🎨 UI Components

The project uses shadcn/ui components built on Radix UI primitives, including:
- Form components with React Hook Form + Zod validation
- Responsive layout components
- Accessibility-focused UI elements
- Custom clinic and patient management components

## 🔧 Development

### Code Style
- TypeScript with strict mode
- ESLint for code quality
- Prettier for code formatting

### Database Migrations
```bash
# Generate migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push
```

### API Development
The backend provides RESTful APIs for:
- Clinic management
- Queue operations
- Patient registration
- Authentication
- Real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🙏 Acknowledgments

- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- Drizzle ORM for type-safe database operations
- Vite for fast development tooling
