module.exports = {
  database: require('./database'),
  
  authMiddleware: require('./authMiddleware').authMiddleware,
  optionalAuth: require('./authMiddleware').optionalAuth,
  
  corsMiddleware: require('./cors').corsMiddleware,
  
  errorHandler: require('./errorHandler').errorHandler,
  notFoundHandler: require('./errorHandler').notFoundHandler,
  asyncHandler: require('./errorHandler').asyncHandler,
  ValidationError: require('./errorHandler').ValidationError,
  UnauthorizedError: require('./errorHandler').UnauthorizedError,
  NotFoundError: require('./errorHandler').NotFoundError,
  ConflictError: require('./errorHandler').ConflictError,
  
  createLogger: require('./logger'),
  
  healthCheck: require('./healthCheck').healthCheck,
  checkDatabase: require('./healthCheck').checkDatabase,
};
