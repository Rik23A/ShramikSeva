/**
 * Client IP Resolution Utility
 * 
 * Accurately extracts the real client IP address when the application is deployed
 * behind reverse proxies (Nginx, Cloudflare, Next.js rewrites, AWS ALB/load balancers).
 */

const SERVER_IPS = new Set([
  '82.112.235.76', // Hostinger VPS Public IP
]);

/**
 * Clean IPv6 mapped prefixes and normalize IP address
 * e.g., "::ffff:192.168.1.1" -> "192.168.1.1"
 */
function normalizeIp(ip) {
  if (!ip || typeof ip !== 'string') return null;
  let cleaned = ip.trim().replace(/^::ffff:/i, '');
  if (cleaned === '::1') {
    return '127.0.0.1';
  }
  return cleaned;
}

/**
 * Checks if an IP is a private/local/server loopback IP
 */
function isLocalOrInternalIp(ip) {
  if (!ip) return true;
  return (
    ip === '127.0.0.1' ||
    ip === 'localhost' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.20.') ||
    ip.startsWith('172.21.') ||
    ip.startsWith('172.22.') ||
    ip.startsWith('172.23.') ||
    ip.startsWith('172.24.') ||
    ip.startsWith('172.25.') ||
    ip.startsWith('172.26.') ||
    ip.startsWith('172.27.') ||
    ip.startsWith('172.28.') ||
    ip.startsWith('172.29.') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    SERVER_IPS.has(ip)
  );
}

/**
 * Extract the real client IP from Express request object
 * 
 * Priority:
 * 1. Cloudflare Headers: cf-connecting-ip, true-client-ip
 * 2. Nginx X-Real-IP: Set explicitly by Nginx from $remote_addr
 * 3. X-Forwarded-For: The first non-server IP in the proxy chain
 * 4. Express req.ips: Left-most IP if trust proxy is enabled
 * 5. Express req.ip
 * 6. Direct socket / connection remoteAddress
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} - Cleaned IP address string or null
 */
function getClientIp(req) {
  if (!req) return null;

  // 1. Cloudflare Headers (always set by Cloudflare edge directly from the client TCP connection)
  const cfConnectingIp = req.headers?.['cf-connecting-ip'] || req.headers?.['true-client-ip'];
  if (cfConnectingIp) {
    const normalized = normalizeIp(cfConnectingIp);
    if (normalized) return normalized;
  }

  // 2. X-Forwarded-For chain: client, proxy1, proxy2, ...
  // When requests pass through multi-hop proxies (Client -> Nginx -> Next.js rewrite -> Express),
  // the very first entry is the originating client IP.
  const xForwardedFor = req.headers?.['x-forwarded-for'];
  if (xForwardedFor) {
    const rawList = typeof xForwardedFor === 'string'
      ? xForwardedFor.split(',')
      : (Array.isArray(xForwardedFor) ? xForwardedFor : []);

    const ips = rawList.map(item => normalizeIp(item)).filter(Boolean);

    // Prefer the first IP that is NOT the server's own VPS IP
    const clientCandidate = ips.find(ip => !SERVER_IPS.has(ip));
    if (clientCandidate) {
      return clientCandidate;
    }

    // If all entries were server IPs or empty, fall back to the first one available
    if (ips.length > 0) {
      return ips[0];
    }
  }

  // 3. Nginx X-Real-IP (if Nginx was configured with proxy_set_header X-Real-IP $remote_addr)
  const xRealIp = req.headers?.['x-real-ip'];
  if (xRealIp) {
    const normalized = normalizeIp(xRealIp);
    if (normalized && !SERVER_IPS.has(normalized)) {
      return normalized;
    }
  }

  // 4. Express req.ips array (populated when app.set('trust proxy', true) is enabled)
  if (req.ips && Array.isArray(req.ips) && req.ips.length > 0) {
    const normalizedList = req.ips.map(normalizeIp).filter(Boolean);
    const clientCandidate = normalizedList.find(ip => !SERVER_IPS.has(ip));
    if (clientCandidate) return clientCandidate;
    if (normalizedList.length > 0) return normalizedList[0];
  }

  // 5. Express req.ip
  if (req.ip) {
    const normalized = normalizeIp(req.ip);
    if (normalized && !SERVER_IPS.has(normalized)) return normalized;
  }

  // 6. Direct socket / connection address
  const socketIp = normalizeIp(req.socket?.remoteAddress || req.connection?.remoteAddress);
  if (socketIp && !SERVER_IPS.has(socketIp)) {
    return socketIp;
  }

  // Fallback if everything matched the server IP or internal addresses
  return (
    normalizeIp(req.headers?.['x-real-ip']) ||
    normalizeIp(req.ip) ||
    socketIp ||
    '127.0.0.1'
  );
}

module.exports = {
  getClientIp,
  normalizeIp,
  isLocalOrInternalIp,
};
