require('dotenv').config();

const express = require('express');
const {
  corsMiddleware,
  errorHandler,
  notFoundHandler,
  createLogger,
  healthCheck
} = require('../shared');

const alertRoutes = require('./routes/alert.routes');
const AlertWorker = require('./services/alertWorker.service');

const logger = createLogger('Alerts-Service');
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use((req, res, next) => {
  logger.http(req.method, req.path);
  next();
});

app.get('/health', healthCheck('Alerts Service', '1.0.0'));

app.use('/api/v1/alerts', alertRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  logger.info('Alerts Service started', { port: PORT, url: `http://localhost:${PORT}` });
});

const alertWorker = new AlertWorker({
  intervalMs: parseInt(process.env.ALERT_CHECK_INTERVAL_MS || '60000')
});

if (process.env.ENABLE_ALERT_WORKER !== 'false') {
  alertWorker.start();
  logger.info('Alert worker started', { intervalMs: alertWorker.intervalMs });
}

const shutdown = () => {
  logger.info('Shutdown signal received, closing gracefully...');
  alertWorker.stop();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
