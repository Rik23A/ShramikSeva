# Translation System Setup Guide

Complete guide for setting up the LibreTranslate-based translation system for Shramik Seva.

## Table of Contents

1. [Overview](#overview)
2. [Development Setup](#development-setup)
3. [Production Setup](#production-setup)
4. [How It Works](#how-it-works)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The translation system automatically translates dynamic content (job posts, messages) into 12 Indian languages using a dual-provider architecture with Google Translate as primary and LibreTranslate as fallback, while keeping static UI text in i18n JSON files.

**Supported Languages:**
- English (en)
- Hindi (hi)
- Bengali (bn)
- Telugu (te)
- Tamil (ta)
- Marathi (mr)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Odia (or)
- Assamese (as)

**Features:**
- ✅ Dual-provider translation (Google Translate primary, LibreTranslate fallback)
- ✅ Real-time translation of job posts and messages
- ✅ MongoDB caching with provider tracking (30-day TTL)
- ✅ Automatic language detection
- ✅ No changes to original database data
- ✅ Free and open-source (no API keys required)

---

## Development Setup

### Option 1: Public API (Easiest - Current Setup)

**No installation required!** Already configured in your project.

**Pros:**
- Zero setup
- Works immediately
- Good for development/testing

**Cons:**
- Rate limited (10 requests/minute)
- Slower during high traffic

**Configuration:**

Your `backend/.env` is configured with dual-provider system:
```env
TRANSLATION_PRIMARY_PROVIDER=google
TRANSLATION_FALLBACK_ENABLED=true
LIBRETRANSLATE_API_URL=https://libretranslate.com/translate
TRANSLATION_CACHE_ENABLED=true
TRANSLATION_CACHE_TTL_DAYS=30
```

**That's it!** Google Translate is used as primary, LibreTranslate as fallback.

### Option 2: Local Docker (Unlimited Translations)

For unlimited translations during development:

#### Prerequisites

1. **Install Docker Desktop for Windows:**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and restart your computer
   - Verify: `docker --version`

#### Setup Steps

1. **Run LibreTranslate:**

```powershell
# Pull the image
docker pull libretranslate/libretranslate:latest

# Start LibreTranslate
docker run -d `
  --name libretranslate `
  -p 5001:5000 `
  --restart unless-stopped `
  libretranslate/libretranslate
```

2. **Update `backend/.env`:**

```env
# Change from public API to local
LIBRETRANSLATE_API_URL=http://localhost:5001/translate
```

3. **Restart backend:**

```powershell
# Stop current backend (Ctrl+C in terminal)
# Then restart
cd backend
npm run dev
```

4. **Test it:**

Open browser: http://localhost:5001

You should see LibreTranslate interface.

#### Docker Management

```powershell
# Check status
docker ps

# View logs
docker logs libretranslate

# Stop
docker stop libretranslate

# Start
docker start libretranslate

# Remove
docker rm -f libretranslate
```

---

## Production Setup

### Server Requirements

- Linux server (Ubuntu/Debian recommended)
- 4GB RAM minimum
- 2 CPU cores minimum
- Docker installed

### Step-by-Step Production Deployment

#### 1. SSH into Your Server

```bash
ssh user@your-server-ip
```

#### 2. Install Docker

```bash
# Download and install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
```

#### 3. Deploy LibreTranslate

```bash
# Pull the image
docker pull libretranslate/libretranslate:latest

# Run LibreTranslate (optimized for Indian languages)
docker run -d \
  --name libretranslate \
  -p 5001:5000 \
  --restart unless-stopped \
  -e LT_LOAD_ONLY=en,hi,bn,te,ta,mr,gu,kn,ml,pa \
  --memory="4g" \
  --cpus="2" \
  libretranslate/libretranslate
```

**Configuration explained:**
- `-p 5001:5000` - Maps to port 5001 (avoids conflict with backend on port 5000)
- `--restart unless-stopped` - Auto-restart on server reboot
- `-e LT_LOAD_ONLY` - Only load needed languages (saves memory)
- `--memory="4g"` - Limit to 4GB RAM
- `--cpus="2"` - Limit to 2 CPU cores

#### 4. Configure Firewall (Security)

```bash
# LibreTranslate should NOT be accessible from outside
sudo ufw deny 5001
sudo ufw allow from 127.0.0.1 to any port 5001
```

#### 5. Update Backend Configuration

Update your production `backend/.env`:

```env
LIBRETRANSLATE_API_URL=http://localhost:5001/translate
TRANSLATION_CACHE_ENABLED=true
TRANSLATION_CACHE_TTL_DAYS=30
```

#### 6. Restart Backend

```bash
# If using PM2
pm2 restart backend

# If using systemd
sudo systemctl restart your-backend-service
```

#### 7. Verify Setup

```bash
# Check container status
docker ps | grep libretranslate

# Test translation
curl -X POST "http://localhost:5001/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "q": "Hello, welcome to Shramik Seva",
    "source": "en",
    "target": "hi",
    "format": "text"
  }'

# Expected: {"translatedText":"नमस्ते, श्रमिक सेवा में आपका स्वागत है"}
```

### Advanced Production Configuration

#### Using Docker Compose (Recommended)

Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  libretranslate:
    image: libretranslate/libretranslate:latest
    container_name: libretranslate
    ports:
      - "5001:5000"
    environment:
      - LT_LOAD_ONLY=en,hi,bn,te,ta,mr,gu,kn,ml,pa
      - LT_THREADS=4
      - LT_CACHE_SIZE=1000
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

Deploy:
```bash
docker-compose up -d
```

#### With API Key Protection (Optional)

```bash
docker run -d \
  --name libretranslate \
  -p 5001:5000 \
  -e LT_API_KEYS=true \
  -e LT_API_KEYS_DB_PATH=/app/db/api_keys.db \
  -e LT_LOAD_ONLY=en,hi,bn,te,ta,mr,gu,kn,ml,pa \
  -v libretranslate-data:/app/db \
  --restart unless-stopped \
  libretranslate/libretranslate

# Create API key
docker exec -it libretranslate python scripts/manage_keys.py add your-secret-key
```

Update `backend/.env`:
```env
LIBRETRANSLATE_API_URL=http://localhost:5001/translate
LIBRETRANSLATE_API_KEY=your-secret-key
```

---

## How It Works

### Architecture

```
User selects Hindi
    ↓
Frontend requests jobs with ?locale=hi
    ↓
Backend checks MongoDB cache
    ↓
    ├─ Cache Hit → Update hitCount & lastAccessedAt → Return cached translation (instant)
    │
    └─ Cache Miss → Try Google Translate API
                    ↓
                    ├─ Success → Save to MongoDB cache (provider: google)
                    │            ↓
                    │            Return translated text
                    │
                    └─ Failure → Try LibreTranslate API (fallback)
                                 ↓
                                 ├─ Success → Save to MongoDB cache (provider: libretranslate)
                                 │            ↓
                                 │            Return translated text
                                 │
                                 └─ Failure → Return original text
```

### Translation Flow

1. **User changes language** in the app
2. **Frontend detects locale** using `useTranslationLocale()` hook
3. **API calls include locale** parameter (e.g., `?locale=hi`)
4. **Backend checks cache** in MongoDB (with hitCount tracking)
5. **If not cached**, tries Google Translate API first
6. **If Google fails**, falls back to LibreTranslate API
7. **Saves translation** to MongoDB with provider info (30-day TTL)
8. **Returns translated data** to frontend
9. **Frontend displays** translated content

### What Gets Translated

**Dynamic Content (via LibreTranslate):**
- ✅ Job titles
- ✅ Job descriptions
- ✅ Skills
- ✅ Worker types
- ✅ Location addresses
- ✅ Message text

**Static Content (via i18n JSON files):**
- ✅ UI labels
- ✅ Buttons
- ✅ Navigation
- ✅ Form fields
- ✅ Error messages

---

## Testing

### 1. Start Your Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Test Translation

1. Open browser: http://localhost:3000
2. Login to your account
3. Go to Jobs page
4. **Change language** using language selector (top right)
5. Watch jobs translate automatically!

### 3. Verify Caching

**First load (cache miss):**
- Check backend logs: `Translating: "Job Title" from en to hi`
- Takes ~1-2 seconds

**Second load (cache hit):**
- Check backend logs: `Cache hit for translation: "Job Title" -> hi`
- Instant (<100ms)

### 4. Check MongoDB Cache

```bash
# Connect to MongoDB
mongosh "your-mongodb-connection-string"

# View cached translations
use your-database-name
db.translationcaches.find().pretty()

# Count cached translations
db.translationcaches.countDocuments()
```

### 5. Test All Languages

Try switching between:
- English → Hindi
- Hindi → Bengali
- Bengali → Tamil
- Tamil → Telugu

Each should translate automatically!

---

## Troubleshooting

### Issue: Rate Limit Errors (Development)

**Symptom:**
```
Translation error: Request failed with status code 429
LibreTranslate API error: { error: 'Slowdown: 10 per 1 minute' }
```

**Cause:** Using public API with rate limits (10 requests/minute)

**Solutions:**

**Option A: Wait and retry**
- Caching reduces subsequent calls
- Rate limit resets every minute

**Option B: Use local Docker**
- Follow [Development Setup - Option 2](#option-2-local-docker-unlimited-translations)
- Unlimited translations

### Issue: Slow First Translation

**Symptom:** First translation takes 30+ seconds

**Cause:** LibreTranslate loading language models

**Solution:** This is normal! Subsequent translations are fast (<500ms)

**Pre-warm cache (optional):**
```bash
# Test all language pairs
for lang in hi bn te ta mr gu kn ml pa; do
  curl -X POST "http://localhost:5001/translate" \
    -H "Content-Type: application/json" \
    -d "{\"q\":\"test\",\"source\":\"en\",\"target\":\"$lang\"}"
done
```

### Issue: Docker Container Won't Start

**Check logs:**
```bash
docker logs libretranslate
```

**Common fixes:**

**1. Port conflict:**
```bash
# Use different port
docker run -d --name libretranslate -p 5002:5000 libretranslate/libretranslate

# Update .env
LIBRETRANSLATE_API_URL=http://localhost:5002/translate
```

**2. Memory issue:**
```bash
# Increase Docker memory in Docker Desktop settings
# Settings → Resources → Memory → 8GB
```

**3. Remove and recreate:**
```bash
docker rm -f libretranslate
docker run -d --name libretranslate -p 5001:5000 libretranslate/libretranslate
```

### Issue: Translations Not Showing

**Check:**

1. **Backend logs** - Are translations being called?
2. **Network tab** - Is `?locale=hi` in API requests?
3. **Frontend console** - Any errors?

**Common fixes:**

**1. Clear browser cache:**
```
Ctrl + Shift + Delete → Clear cache
```

**2. Restart backend:**
```bash
# Stop (Ctrl+C) and restart
npm run dev
```

**3. Check .env:**
```env
# Make sure this is set
LIBRETRANSLATE_API_URL=http://localhost:5001/translate
```

### Issue: MongoDB Connection Failed

**Symptom:**
```
MongoDB connection failed: querySrv ENOTFOUND
```

**Solution:** Check MongoDB connection string in `backend/.env`:
```env
MONGODB_URI=your-mongodb-connection-string
```

---

## Performance Metrics

### Expected Performance

**Development (Public API):**
- First translation: 1-2 seconds
- Cached translation: <100ms
- Rate limit: 10 requests/minute

**Production (Self-hosted):**
- First translation: ~500ms
- Cached translation: <50ms
- No rate limits
- 10-20 concurrent requests/second

### Cache Efficiency

After initial use:
- Cache hit rate: >90%
- Average response time: <100ms
- API calls reduced by: 90%+

### Resource Usage (Production)

**LibreTranslate Container:**
- Memory: 2-4GB
- CPU: 10-30% average
- Disk: ~2GB

**MongoDB Cache:**
- ~200 bytes per translation
- 1000 translations ≈ 200KB
- Auto-cleanup after 30 days

---

## Cost Comparison

| Solution | Setup | Monthly Cost | Rate Limit | Performance |
|----------|-------|--------------|------------|-------------|
| Google Translate API | Easy | $20/1M chars | None | Fast |
| LibreTranslate Public | None | $0 | 10/min | Slow |
| **LibreTranslate Self-Hosted** | **Medium** | **$0** | **None** | **Fast** |

**Recommendation:** Self-host in production for best performance and zero cost.

---

## Production Checklist

Before deploying to production:

- [ ] Docker installed on server
- [ ] LibreTranslate container running
- [ ] Port 5001 accessible only from localhost
- [ ] Firewall configured
- [ ] Backend `.env` updated
- [ ] Backend restarted
- [ ] Translation tested
- [ ] Container auto-restart enabled
- [ ] MongoDB caching verified
- [ ] All 12 languages tested

---

## Support & Resources

**Documentation:**
- LibreTranslate: https://github.com/LibreTranslate/LibreTranslate
- Docker: https://docs.docker.com/

**Monitoring:**
```bash
# Container status
docker ps

# Resource usage
docker stats libretranslate

# Logs
docker logs -f libretranslate
```

**Updates:**
```bash
# Pull latest version
docker pull libretranslate/libretranslate:latest

# Recreate container
docker stop libretranslate
docker rm libretranslate
docker run -d --name libretranslate -p 5001:5000 libretranslate/libretranslate
```

---

## Summary

✅ **Translation system is fully implemented**
✅ **Works with public API (development)**
✅ **Ready for self-hosted deployment (production)**
✅ **Automatic caching reduces API calls**
✅ **No changes to original database**
✅ **Free and open-source**

**Next Steps:**
1. ✅ Development: Continue using public API
2. 🚀 Production: Deploy LibreTranslate on your server
3. 📊 Monitor: Check cache hit rates and performance
4. 🎯 Optimize: Adjust cache TTL and language models as needed

**You're all set!** 🎉
