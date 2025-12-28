const express = require('express');
require('dotenv').config();

const config = require('./config/config');
const {
  database,
  corsMiddleware,
  errorHandler,
  notFoundHandler,
  createLogger,
  healthCheck,
  checkDatabase
} = require('../shared');

// Import routes
const portfolioRoutes = require('./routes/portfolio.routes');
const exchangeRoutes = require('./routes/exchange.routes');
const manualHoldingRoutes = require('./routes/manualHolding.routes');

const logger = createLogger('Exchange-Connections-Service');
const { pool } = database;
const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  logger.http(req.method, req.path);
  next();
});

app.get('/health', healthCheck('Portfolio & Exchange Service', '3.0.0', async () => {
  return await checkDatabase(pool);
}));

app.use('/api/v1/portfolios', portfolioRoutes);
app.use('/api/v1/exchanges', exchangeRoutes);
app.use('/api/v1/manual-holdings', manualHoldingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
const PORT = config.port || 5000;
const server = app.listen(PORT, () => {
  logger.info('Portfolio & Exchange Service started', {
    port: PORT,
    version: '3.0.0',
    features: [
      'Portfolio Management',
      'Transaction Tracking',
      'Spot Trading History',
      'Conversion History',
      'Wallet Address Display',
      'P&L Calculations',
      'Exchange Integration'
    ]
  });
  logger.info('API endpoints available', {
    api: `http://localhost:${PORT}/api/v1`,
    health: `http://localhost:${PORT}/health`
  });
});

const shutdown = () => {
  logger.info('Shutdown signal received, closing gracefully...');
  server.close(() => {
    pool.end(() => {
      logger.info('Database connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
