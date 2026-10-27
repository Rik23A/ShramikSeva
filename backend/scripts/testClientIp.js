const assert = require('assert');
const { getClientIp, normalizeIp, isLocalOrInternalIp } = require('../utils/clientIp');

console.log('🧪 Starting Client IP Resolution Unit Tests...\n');

// Test 1: Multi-hop proxy where Next.js / Nginx appends the VPS IP (82.112.235.76)
{
  const mockReq = {
    headers: {
      'x-forwarded-for': '122.161.45.67, 82.112.235.76',
    },
    ip: '82.112.235.76',
    socket: { remoteAddress: '127.0.0.1' },
  };
  const ip = getClientIp(mockReq);
  assert.strictEqual(ip, '122.161.45.67', `Expected 122.161.45.67 but got ${ip}`);
  console.log('✅ Test 1 Passed: Multi-hop X-Forwarded-For extracts real user IP over server IP.');
}

// Test 2: Nginx with X-Real-IP
{
  const mockReq = {
    headers: {
      'x-real-ip': '103.21.244.10',
    },
    ip: '82.112.235.76',
    socket: { remoteAddress: '82.112.235.76' },
  };
  const ip = getClientIp(mockReq);
  assert.strictEqual(ip, '103.21.244.10', `Expected 103.21.244.10 but got ${ip}`);
  console.log('✅ Test 2 Passed: Nginx X-Real-IP extracts client IP.');
}

// Test 3: Cloudflare edge header
{
  const mockReq = {
    headers: {
      'cf-connecting-ip': '49.37.152.12',
      'x-forwarded-for': '49.37.152.12, 172.68.10.1',
    },
    ip: '172.68.10.1',
  };
  const ip = getClientIp(mockReq);
  assert.strictEqual(ip, '49.37.152.12', `Expected 49.37.152.12 but got ${ip}`);
  console.log('✅ Test 3 Passed: Cloudflare CF-Connecting-IP takes highest priority.');
}

// Test 4: IPv6 mapped IPv4 address
{
  const mockReq = {
    headers: {
      'x-forwarded-for': '::ffff:157.34.12.89',
    },
  };
  const ip = getClientIp(mockReq);
  assert.strictEqual(ip, '157.34.12.89', `Expected 157.34.12.89 but got ${ip}`);
  console.log('✅ Test 4 Passed: ::ffff: IPv6 mapped prefixes are stripped cleanly.');
}

// Test 5: Express req.ips array (multi-proxy with trust proxy: true)
{
  const mockReq = {
    ips: ['115.96.22.4', '82.112.235.76'],
    ip: '82.112.235.76',
  };
  const ip = getClientIp(mockReq);
  assert.strictEqual(ip, '115.96.22.4', `Expected 115.96.22.4 but got ${ip}`);
  console.log('✅ Test 5 Passed: Express req.ips correctly identifies client IP.');
}

// Test 6: Direct localhost/socket
{
  const mockReq = {
    socket: { remoteAddress: '127.0.0.1' },
  };
  const ip = getClientIp(mockReq);
  assert.strictEqual(ip, '127.0.0.1', `Expected 127.0.0.1 but got ${ip}`);
  console.log('✅ Test 6 Passed: Direct socket connection fallback works.');
}

console.log('\n🎉 ALL 6 CLIENT IP RESOLUTION TESTS PASSED SUCCESSFULLY!\n');
