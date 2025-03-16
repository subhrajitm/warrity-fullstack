# Warrity - Warranty Management System

<div align="center">
  <img src="public/images/warrity-logo.png" alt="Warrity Logo" width="200"/>
  <p><em>Your Complete Warranty Management Solution</em></p>
</div>

## Overview

Warrity is a comprehensive warranty management application designed to help users track, manage, and organize product warranties efficiently. The platform provides a user-friendly interface for both regular users and administrators, offering features like warranty tracking, calendar scheduling, profile management, and administrative controls.

## Features

### User Features

- **Dashboard**: Overview of all warranties, upcoming expirations, and important notifications
- **Warranty Management**: 
  - Add, view, edit, and delete product warranties
  - Filter warranties by status (active, expiring, expired)
  - Track warranty details including purchase date, expiration date, and coverage details
- **Calendar**: 
  - Visual calendar interface for tracking warranty expirations and maintenance schedules
  - Add and manage events with detailed information
  - Filter events by type (warranty, maintenance)
  - View event details with product associations
  - Delete or modify scheduled events
- **Profile Management**:
  - Personalized user profiles with customizable information
  - Profile picture upload
  - Bio and social media links (Twitter, LinkedIn, GitHub, Instagram)
  - Account settings and preferences
- **Notifications**: Receive alerts for expiring warranties and scheduled maintenance

### Admin Features

- **User Management**: Add, edit, and manage user accounts
- **Product Management**: Manage product catalog and categories
- **Warranty Oversight**: View and manage all warranties in the system
- **Analytics Dashboard**: Visualize data on warranties, users, and system usage
- **Settings**: Configure system-wide settings and preferences
  - General settings
  - Notification settings
  - Security settings

## Recent Updates

### Enhanced Profile Functionality (March 2024)
- Added profile picture upload capability
- Implemented bio section for user descriptions
- Added social media integration with popular platforms
- Improved UI with responsive design for all devices

### Calendar Management System (March 2024)
- Implemented interactive calendar for tracking warranty and maintenance events
- Added event creation with detailed information
- Integrated product association with calendar events
- Created filtering system for different event types
- Added event details view with management options

### Admin Dashboard Improvements (March 2024)
- Fixed sidebar navigation to improve usability
- Enhanced analytics visualizations
- Improved settings organization with tabbed interface
- Added responsive design for mobile admin access

## Technology Stack

- **Frontend**: 
  - Next.js 15.1.0 (React 19)
  - TypeScript
  - Tailwind CSS for styling
  - Shadcn UI components
  - Lucide React for icons
  - Framer Motion for animations

- **State Management**:
  - React Hooks
  - Context API

- **Form Handling**:
  - React Hook Form
  - Zod for validation

- **UI Components**:
  - Radix UI primitives
  - React Day Picker for calendar
  - Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/warrity.git
   cd warrity
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

## Project Structure

```
warrity/
├── app/                  # Next.js app directory
│   ├── admin/            # Admin panel pages
│   ├── user/             # User pages
│   ├── products/         # Product pages
│   ├── login/            # Authentication pages
│   ├── register/         # User registration
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   └── admin-sidebar.tsx # Admin sidebar component
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
├── styles/               # Additional styles
└── ...                   # Configuration files
```

## User Guide

### User Registration and Login

1. Navigate to the registration page at `/register`
2. Fill in your details and create an account
3. Log in with your credentials at `/login`

### Managing Warranties

1. From the user dashboard, navigate to "All Warranties"
2. Click "Add Warranty" to register a new product warranty
3. View warranty details by clicking on a specific warranty
4. Edit or delete warranties as needed

### Using the Calendar

1. Navigate to the Calendar section from the sidebar
2. Browse dates to see scheduled events
3. Click "Add Event" to create a new calendar event
4. View event details by clicking on an event card

### Admin Functions

1. Log in with admin credentials
2. Access the admin dashboard at `/admin`
3. Manage users, products, and warranties from the respective sections
4. View analytics and configure system settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Development Plans

### Upcoming Features

- **Mobile Application**: Native mobile apps for iOS and Android
- **Email Notifications**: Automated email alerts for warranty expirations
- **QR Code Integration**: Scan product QR codes to quickly add warranties
- **Export Functionality**: Export warranty data to PDF or CSV formats
- **Advanced Analytics**: Enhanced reporting and data visualization
- **Multi-language Support**: Internationalization for global users
- **Dark Mode**: Enhanced UI with dark mode support
- **API Integration**: Connect with manufacturer databases for automatic warranty information

### Long-term Roadmap

- **Blockchain Integration**: Secure warranty verification using blockchain technology
- **AI Recommendations**: Smart recommendations for warranty renewals and product maintenance
- **Community Features**: User forums and knowledge sharing
- **Marketplace**: Connect users with warranty extension providers
- **Enterprise Version**: Enhanced features for business and enterprise users

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
