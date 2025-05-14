# Warrity API

The backend API for the Warrity Warranty Management System.

## Overview

This API provides all the necessary endpoints for the Warrity application, including user authentication, warranty management, product management, calendar events, and admin functionality.

## Technologies Used

- Node.js (v16+)
- Express.js
- MongoDB
- JWT Authentication
- Helmet for security
- Compression
- Winston for logging
- Express Rate Limit
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to the API directory:
   ```
   cd api
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your configuration
6. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the documentation at:

```
http://localhost:5001/api-docs/
```

The documentation includes:
- Detailed descriptions of all endpoints
- Request and response schemas
- Authentication requirements
- Example requests and responses
- Testing endpoints directly from the UI

The Swagger documentation is organized into the following sections:
- Authentication
- Users
- Warranties
- Products
- Events
- Admin

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout a user

### Health Checks
- `GET /api/health` - Basic health check endpoint that returns server status, uptime, and system information
- `GET /api/health/deep` - Deep health check that includes database connection status

### User Management
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `POST /api/users/:id/profile-picture` - Upload profile picture

### Warranty Management
- `GET /api/warranties` - Get all warranties for current user
- `POST /api/warranties` - Create a new warranty
- `GET /api/warranties/:id` - Get warranty by ID
- `PUT /api/warranties/:id` - Update warranty
- `DELETE /api/warranties/:id` - Delete warranty
- `GET /api/warranties/expiring` - Get warranties expiring soon

### Product Management
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (admin only)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories` - Get all product categories

### Calendar Events
- `GET /api/events` - Get all events for current user
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/date/:date` - Get events for a specific date

### Admin Functionality
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/warranties` - Get all warranties
- `GET /api/admin/products` - Get all products
- `GET /api/admin/events` - Get all events

## File Structure

```
api/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.js         # Entry point
├── logs/                 # Application logs
├── uploads/              # Uploaded files
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
└── README.md             # Documentation
```

## Security Considerations

The API includes several security features:

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Helmet for HTTP headers
- Input validation with Express Validator
- Secure environment variable handling

## Monitoring and Logging

- Winston logger for application logs
- Morgan for HTTP request logging
- Health check endpoints for monitoring

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection errors:

1. Ensure MongoDB is running on your system
2. Check your MongoDB connection string in the .env file
3. If using MongoDB Atlas, ensure your IP address is whitelisted in the Atlas dashboard
4. Check network connectivity to your MongoDB instance