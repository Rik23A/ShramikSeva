# Performance Monitoring Guide

## Overview

The Shramik Seva backend includes comprehensive performance monitoring to track API health, performance, and errors.

## Features

### 1. Request Tracking
- Total requests
- Success/error rates
- Slow request detection (>1000ms)
- Request duration tracking

### 2. Endpoint Analytics
- Top 10 most called endpoints
- Top 10 slowest endpoints
- Average response times
- Error rates per endpoint

### 3. Error Tracking
- Last 100 errors with stack traces
- Error timestamps and URLs
- Error rate calculation

### 4. Slow Query Detection
- Tracks requests >1000ms
- Keeps last 50 slow queries
- Includes IP, method, URL, duration

### 5. System Metrics
- Memory usage (RSS, Heap, External)
- CPU usage
- Server uptime
- Node.js version

### 6. Database Monitoring
- Connection status
- Database name and host

## Accessing Metrics

### Development
```bash
curl http://localhost:5000/api/metrics
```

### Production
Requires authentication header:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://your-domain.com/api/metrics
```

## Metrics Response Format

```json
{
  "success": true,
  "metrics": {
    "summary": {
      "total": 1250,
      "success": 1180,
      "errors": 70,
      "slow": 15,
      "errorRate": "5.60%",
      "slowRate": "1.20%"
    },
    "topEndpoints": [
      {
        "endpoint": "GET /api/jobs",
        "count": 450,
        "avgDuration": 125,
        "errors": 5,
        "lastCalled": "2026-02-02T10:30:00.000Z"
      }
    ],
    "slowestEndpoints": [
      {
        "endpoint": "GET /api/users/dashboard/worker",
        "avgDuration": 850,
        "count": 120
      }
    ],
    "recentErrors": [
      {
        "message": "Job not found",
        "url": "/api/jobs/123",
        "method": "GET",
        "timestamp": "2026-02-02T10:25:00.000Z"
      }
    ],
    "recentSlowQueries": [
      {
        "method": "GET",
        "url": "/api/jobs",
        "duration": 1250,
        "timestamp": "2026-02-02T10:20:00.000Z",
        "ip": "192.168.1.1"
      }
    ],
    "database": {
      "status": "connected",
      "host": "cluster.mongodb.net",
      "name": "shramik_seva"
    },
    "system": {
      "uptime": 3600,
      "memory": {
        "rss": "150 MB",
        "heapTotal": "80 MB",
        "heapUsed": "65 MB",
        "external": "5 MB"
      },
      "nodeVersion": "v18.17.0",
      "platform": "linux"
    }
  }
}
```

## Monitoring Dashboard

### Key Metrics to Watch

1. **Error Rate** - Should be <5%
2. **Slow Rate** - Should be <2%
3. **Memory Usage** - Watch for memory leaks
4. **Database Status** - Should always be "connected"

### Alerts to Set Up

- Error rate >10%
- Slow query rate >5%
- Memory usage >500 MB
- Database disconnection

## Hourly Reports

The monitoring system automatically logs hourly summaries:

```
📊 Hourly Metrics Summary: {
  requests: { total: 1250, success: 1180, errors: 70, slow: 15 },
  topEndpoints: [
    { endpoint: 'GET /api/jobs', count: 450 },
    { endpoint: 'GET /api/users/profile', count: 320 }
  ]
}
```

## Integration with External Tools

### Recommended Tools

1. **Grafana** - Visualize metrics
2. **Prometheus** - Metrics collection
3. **New Relic** - APM
4. **Datadog** - Infrastructure monitoring
5. **Sentry** - Error tracking

### Custom Integration

You can export metrics to external tools:

```javascript
const { getMetrics } = require('./middleware/monitoring');

// Export to your monitoring service
setInterval(() => {
  const metrics = getMetrics();
  // Send to external service
  sendToMonitoringService(metrics);
}, 60000); // Every minute
```

## Performance Optimization Tips

Based on metrics:

1. **High Error Rate** - Check recent errors for patterns
2. **Slow Endpoints** - Add caching or optimize queries
3. **High Memory** - Check for memory leaks
4. **Database Issues** - Check connection pool settings

## Troubleshooting

### Metrics Not Updating
- Check if monitoring middleware is loaded
- Verify middleware order in index.js

### High Memory Usage
- Check for memory leaks
- Restart server if needed
- Review recent code changes

### Slow Queries
- Check database indexes
- Optimize populate() calls
- Add pagination

---

**Status**: ✅ Monitoring system active and tracking all requests
