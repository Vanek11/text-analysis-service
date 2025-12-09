import rateLimit from 'express-rate-limit';

/**
 * Rate limiter для ограничения количества запросов
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 100, // 100 запросов в час для неаутентифицированных пользователей
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

