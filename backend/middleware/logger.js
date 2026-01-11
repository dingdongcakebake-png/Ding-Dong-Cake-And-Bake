export const logger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    };

    // Log different levels based on status code
    if (res.statusCode >= 400) {
      console.error('❌ HTTP Error:', log);
    } else if (res.statusCode >= 300) {
      console.warn('⚠️  HTTP Redirect:', log);
    } else {
      console.log('✅ HTTP Success:', log);
    }
  });

  next();
};