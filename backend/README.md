# Shramik Seva Backend API

A production-ready Node.js/Express backend for the Shramik Seva platform - connecting workers with employers in India.

## Features

✅ **RESTful API** - Clean, organized API endpoints  
✅ **Authentication** - JWT + Firebase authentication  
✅ **Database** - MongoDB with Mongoose ODM  
✅ **Real-time** - Socket.io for messaging and notifications  
✅ **Security** - Helmet, CORS, rate limiting, request sanitization  
✅ **File Uploads** - Cloudinary integration  
✅ **Payments** - Razorpay and Stripe integration  
✅ **Geolocation** - Location-based job recommendations  
✅ **Cron Jobs** - Automated cleanup and maintenance tasks  
✅ **Error Handling** - Comprehensive error handling and logging  
✅ **Production Ready** - Environment validation, monitoring, health checks

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Firebase Admin SDK
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Payments**: Razorpay, Stripe
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB instance running
- Environment variables configured

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for all required and optional variables.

**Required:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens (min 32 chars)
- `PORT` - Server port (default: 5000)

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── db.js        # Database connection + index initialization
│   └── validateEnv.js # Environment validation
├── controllers/      # Request handlers
├── cron/            # Scheduled tasks
│   ├── dataCleanup.js
│   ├── dailyWorkLog.js
│   └── ...
├── middleware/      # Express middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── security.js
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── socket/          # Socket.io handlers
├── utils/           # Utility functions
│   └── dataCleanup.js
├── index.js         # Application entry point
└── package.json
```

## API Endpoints

### Health Check
- `GET /` - API status
- `GET /api/health` - Detailed health check

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/users/register-firebase` - Firebase registration

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard/worker` - Worker dashboard
- `GET /api/users/dashboard/employer` - Employer dashboard

### Jobs
- `GET /api/jobs` - List jobs (with filters)
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications/:jobId` - Apply to job
- `GET /api/applications/worker` - Worker's applications
- `GET /api/applications/job/:jobId` - Job applications

### Messages
- `GET /api/conversations` - List conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages

See full API documentation for complete endpoint list.

## Security Features

### Rate Limiting
- General API: 100 requests/15 minutes
- Authentication: 5 requests/15 minutes
- Job creation: 10 requests/hour
- File uploads: 20 requests/hour
- Messaging: 50 messages/15 minutes

### Security Headers (Helmet)
- Content Security Policy
- XSS Protection
- Frame Guard
- HSTS (production only)

### Request Sanitization
- NoSQL injection prevention
- XSS attack prevention
- Input validation

## Database

### Indexes

Automatically created on server startup:

**Jobs Collection:**
- `location` (2dsphere) - Geospatial queries
- `employer + status` - Employer job listings
- `status + createdAt` - Job filtering

**Applications Collection:**
- `worker + job` (unique) - Prevent duplicates
- `job + status` - Application filtering

**Notifications Collection:**
- `userId + isRead + createdAt` - Notification queries

**WorkLogs Collection:**
- `job + worker + date` - Work log queries

## Cron Jobs

Automated tasks run on schedule:

- **OTP Reset** - Cleans expired OTPs
- **Daily Work Log** - Processes daily work logs
- **Rating Prompts** - Sends rating reminders
- **Notification Cleanup** - Removes old notifications
- **Data Cleanup** - Removes orphaned data (2 AM daily)

## Error Handling

Comprehensive error handling for:
- Validation errors
- Duplicate key errors
- Invalid ObjectId errors
- JWT errors
- Unhandled promise rejections
- Uncaught exceptions

All errors return consistent JSON format:
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical details (dev only)"
}
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/users/profile
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy with PM2

```bash
npm install -g pm2
pm2 start index.js --name shramik-seva-backend
pm2 save
```

## Monitoring

### Health Check
```bash
curl https://your-domain.com/api/health
```

### Logs
```bash
# PM2
pm2 logs shramik-seva-backend

# Docker
docker-compose logs -f backend
```

## Production Checklist

- [x] Environment validation
- [x] Database indexes
- [x] Error handling
- [x] Rate limiting
- [x] Security headers
- [x] Request sanitization
- [x] CORS configuration
- [x] Data cleanup
- [x] Health checks
- [x] Logging
- [ ] SSL/HTTPS
- [ ] Monitoring setup
- [ ] Backup strategy

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: [your-email]

---

**Status**: ✅ Production Ready

Built with ❤️ for connecting workers and employers in India.
