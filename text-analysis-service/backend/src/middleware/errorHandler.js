import { logger } from '../utils/logger.js';

/**
 * Обработчик ошибок
 */
export function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Ошибка валидации
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  // Ошибка NLP сервиса
  if (err.message.includes('NLP service')) {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'NLP service is currently unavailable. Please try again later.'
    });
  }

  // Ошибка очереди
  if (err.message.includes('queue') || err.message.includes('Redis')) {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Queue service is currently unavailable. Please try again later.'
    });
  }

  // Общая ошибка сервера
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred while processing your request'
  });
}

