import rateLimit from 'express-rate-limit';

export const feedbackRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Muitas requisições, tente novamente em alguns instantes',
  headers: true,
});
