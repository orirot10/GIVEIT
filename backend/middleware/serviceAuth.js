// Service-to-service authentication middleware
const serviceAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.SERVICE_API_KEY;
  
  if (!expectedKey) {
    console.warn('SERVICE_API_KEY not configured - service auth disabled');
    return next();
  }
  
  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      code: 'service-unauthorized',
      error: 'Service authentication required',
      message: 'Valid API key required for service-to-service calls'
    });
  }
  
  next();
};

module.exports = { serviceAuth };