# Shramik Seva Backend - Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure strong `JWT_SECRET` (min 32 characters)
- [ ] Set production `MONGO_URI` with strong credentials
- [ ] Configure `ALLOWED_ORIGINS` with production domain(s)
- [ ] Set up payment gateway credentials (Razorpay/Stripe)
- [ ] Configure Cloudinary for file uploads
- [ ] Set up Firebase authentication

### 2. Database Setup

- [ ] Create production MongoDB database
- [ ] Enable MongoDB IP whitelist
- [ ] Set up database backups
- [ ] Verify database indexes are created (automatic on first run)

### 3. Security

- [ ] Review and update CORS allowed origins
- [ ] Ensure JWT_SECRET is strong and unique
- [ ] Enable HTTPS on production server
- [ ] Configure firewall rules
- [ ] Set up SSL certificates

### 4. Dependencies

```bash
npm install
```

Required packages will be installed including:
- `express-rate-limit` - API rate limiting
- `helmet` - Security headers
- `express-validator` - Request validation

### 5. Testing

```bash
# Run in development mode first
npm run dev

# Test critical endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/

# Verify database indexes
# Check MongoDB logs for index creation messages
```

---

## Deployment Options

### Option 1: Traditional Server (VPS/Dedicated)

#### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install PM2 (Process Manager)
```bash
npm install -g pm2
```

#### Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install --production

# Start with PM2
pm2 start index.js --name shramik-seva-backend

# Enable auto-restart on server reboot
pm2 startup
pm2 save
```

#### PM2 Commands
```bash
# View logs
pm2 logs shramik-seva-backend

# Restart
pm2 restart shramik-seva-backend

# Stop
pm2 stop shramik-seva-backend

# Monitor
pm2 monit
```

---

### Option 2: Docker Deployment

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=your_password
    restart: unless-stopped

volumes:
  mongodb_data:
```

#### Deploy with Docker
```bash
docker-compose up -d
```

---

### Option 3: Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create shramik-seva-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGO_URI=your-mongodb-uri

# Deploy
git push heroku main
```

#### AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

#### Google Cloud Platform
```bash
# Install gcloud CLI
gcloud init

# Deploy
gcloud app deploy
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Health check
curl https://your-domain.com/api/health

# Should return:
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-02-02T...",
  "uptime": 123.45
}
```

### 2. Monitor Logs

```bash
# PM2
pm2 logs shramik-seva-backend

# Docker
docker-compose logs -f backend

# Heroku
heroku logs --tail
```

### 3. Database Verification

Check server logs for:
```
✅ MongoDB connected
✅ Initializing database indexes...
✅ Created 2dsphere index on jobs.location
✅ All database indexes initialized successfully
```

### 4. Cron Jobs Verification

Check logs for:
```
✅ Data cleanup cron job scheduled (daily at 2:00 AM IST)
✅ All cron jobs initialized
```

---

## Monitoring & Maintenance

### Performance Monitoring

1. **Response Times**: Monitor API response times
2. **Error Rates**: Track 4xx and 5xx errors
3. **Database Performance**: Monitor slow queries
4. **Memory Usage**: Watch for memory leaks

### Recommended Tools

- **PM2 Plus**: Advanced monitoring for PM2
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure monitoring
- **Sentry**: Error tracking
- **MongoDB Atlas**: Database monitoring

### Backup Strategy

1. **Database Backups**:
   - Daily automated backups
   - Keep 7 days of backups
   - Test restore process monthly

2. **Code Backups**:
   - Use Git for version control
   - Tag releases
   - Keep deployment scripts

### Scaling Considerations

1. **Horizontal Scaling**:
   - Use load balancer (Nginx, AWS ALB)
   - Run multiple instances with PM2 cluster mode
   - Share sessions via Redis

2. **Vertical Scaling**:
   - Increase server resources as needed
   - Monitor resource usage

---

## Troubleshooting

### Common Issues

#### 1. Server Won't Start

**Check environment variables:**
```bash
node -e "require('dotenv').config(); require('./config/validateEnv').validateEnv()"
```

**Check MongoDB connection:**
```bash
# Verify MONGO_URI is correct
# Check MongoDB server is running
# Verify IP whitelist includes your server
```

#### 2. Rate Limiting Issues

**Adjust rate limits in production:**
Edit `middleware/rateLimiter.js` if needed.

#### 3. CORS Errors

**Verify ALLOWED_ORIGINS:**
```bash
echo $ALLOWED_ORIGINS
```

Should include your frontend domain.

#### 4. Database Index Errors

**Manually create indexes:**
```javascript
// Connect to MongoDB
db.jobs.createIndex({ location: "2dsphere" })
```

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` to Git
- Use secrets management (AWS Secrets Manager, etc.)
- Rotate secrets regularly

### 2. Database Security
- Use strong passwords
- Enable IP whitelist
- Use SSL/TLS connections
- Regular security audits

### 3. API Security
- Rate limiting enabled ✅
- Security headers enabled ✅
- Request sanitization enabled ✅
- HTTPS only in production

### 4. Monitoring
- Set up alerts for errors
- Monitor unusual traffic patterns
- Track failed authentication attempts

---

## Rollback Procedure

If deployment fails:

1. **Revert to previous version:**
   ```bash
   # PM2
   pm2 restart shramik-seva-backend --update-env
   
   # Docker
   docker-compose down
   docker-compose up -d
   
   # Heroku
   heroku rollback
   ```

2. **Restore database backup if needed**

3. **Check logs for errors**

4. **Fix issues and redeploy**

---

## Support & Resources

### Documentation
- API Documentation: `/api/docs` (if implemented)
- Health Check: `/api/health`
- Environment Variables: `.env.example`

### Logs Location
- PM2: `~/.pm2/logs/`
- Docker: `docker-compose logs`
- Application: Console output

### Contact
- Development Team: [your-email]
- Emergency Contact: [emergency-contact]

---

## Production Readiness Checklist

- [x] Environment validation
- [x] Database indexes
- [x] Error handling
- [x] Rate limiting
- [x] Security headers
- [x] Request sanitization
- [x] CORS configuration
- [x] Data cleanup cron jobs
- [x] Health check endpoint
- [x] Logging
- [ ] SSL/HTTPS (server configuration)
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] Load testing
- [ ] Documentation

---

**Status**: ✅ Backend is production-ready with all critical features implemented.

**Next Steps**: Deploy to staging environment for testing before production deployment.
