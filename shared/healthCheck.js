const healthCheck = (serviceName, version = '1.0.0', additionalChecks = null) => {
  return async (req, res) => {
    const healthData = {
      status: 'healthy',
      service: serviceName,
      version: version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };

    // Run additional health checks if provided
    if (additionalChecks) {
      try {
        const checks = await additionalChecks();
        healthData.checks = checks;
      } catch (error) {
        healthData.status = 'unhealthy';
        healthData.error = error.message;
        return res.status(503).json(healthData);
      }
    }

    res.status(200).json(healthData);
  };
};

const checkDatabase = async (pool) => {
  try {
    await pool.query('SELECT 1');
    return { database: 'connected' };
  } catch (error) {
    throw new Error(`Database unhealthy: ${error.message}`);
  }
};

module.exports = {
  healthCheck,
  checkDatabase,
};
