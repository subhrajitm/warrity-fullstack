# Warrity - Full Stack Warranty Management System

<div align="center">
  <p><em>A modern, full-stack warranty management system built with Next.js and TypeScript</em></p>
</div>

## Overview

Warrity is a comprehensive warranty management system that provides a modern web interface, mobile application, and robust backend API. The system enables efficient management of warranties, products, and user interactions across multiple platforms.

## Features

### Web Application
- Modern, responsive UI built with Next.js and Tailwind CSS
- Real-time warranty tracking and management
- Interactive dashboards and analytics
- Role-based access control
- Dark/Light theme support

### Mobile Application
- Cross-platform mobile app
- Offline support
- Push notifications
- QR code scanning for warranty verification
- Mobile-optimized user experience

### Backend API
- RESTful API architecture
- JWT-based authentication
- Role-based access control
- File upload and management
- Real-time notifications

### Core Features
- Warranty registration and tracking
- Product catalog management
- User profile management
- Admin dashboard
- Analytics and reporting
- Document management
- Email notifications

## Technology Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Shadcn UI
  - Radix UI
  - Lucide Icons
- **State Management**: React Context
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **API Framework**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Local Storage
- **Caching**: Redis

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm package manager
- MongoDB 6.x or higher
- Flutter (for mobile development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/subhrajitm/warrity-fullstack.git
   cd warrity-fullstack
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
warrity-fullstack/
├── app/              # Next.js app directory
├── api/              # Backend API routes
├── components/       # Reusable React components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/             # Utility functions and shared code
├── mobile/          # Mobile application code
├── public/          # Static assets
└── types/           # TypeScript type definitions
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm check-deps` - Check for missing dependencies
- `pnpm validate-imports` - Validate import statements

### Dependency Management

The project includes robust dependency management:
- Pre-build dependency checks
- Import validation
- Automatic dependency updates
- TypeScript type checking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
