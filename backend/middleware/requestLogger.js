const sanitizeHeaders = (headers) => {
  const sanitized = { ...headers };
  
  // Remove sensitive headers
  if (sanitized.authorization) {
    sanitized.authorization = '[REDACTED]';
  }
  if (sanitized.cookie) {
    sanitized.cookie = '[REDACTED]';
  }
  if (sanitized['x-api-key']) {
    sanitized['x-api-key'] = '[REDACTED]';
  }
  
  return sanitized;
};

const requestLogger = (req, res, next) => {
  // Skip logging for health check
  if (req.path === '/healthz') {
    return next();
  }
  
  const start = Date.now();
  
  // Log request with sanitized headers
  console.log(`${req.method} ${req.path}`, {
    headers: sanitizeHeaders(req.headers),
    query: req.query,
    // Don't log body as it might contain sensitive data
  });
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

module.exports = requestLogger;