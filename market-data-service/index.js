require('dotenv').config();

const express = require('express');
const {
  corsMiddleware,
  errorHandler,
  notFoundHandler,
  createLogger,
  healthCheck
} = require('../shared');

const marketRoutes = require('./routes/market');
const dashboardRoutes = require('./routes/dashboard');
const newsRoutes = require('./routes/news');

const logger = createLogger('Market-Data-Service');
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use((req, res, next) => {
  logger.http(req.method, req.path);
  next();
});

app.get('/health', healthCheck('Market Data Service', '1.0.0'));

app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/news', newsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info('Market Data Service started', { port: PORT, url: `http://localhost:${PORT}` });
});
