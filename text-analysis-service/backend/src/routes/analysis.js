import express from 'express';
import { analyzeText, analyzeTextAsync, getAnalysisStatus } from '../services/analysisService.js';
import { validateAnalysisRequest } from '../middleware/validator.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/v1/analyze
 * Синхронный анализ текста
 */
router.post('/analyze', rateLimiter, validateAnalysisRequest, async (req, res, next) => {
  try {
    const { text, options } = req.body;
    const result = await analyzeText(text, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/analyze/async
 * Асинхронный анализ текста (для длинных текстов)
 */
router.post('/analyze/async', rateLimiter, validateAnalysisRequest, async (req, res, next) => {
  try {
    const { text, options } = req.body;
    const job = await analyzeTextAsync(text, options);
    res.json({
      job_id: job.id,
      status: 'queued'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/analyze/status/:job_id
 * Проверка статуса асинхронного анализа
 */
router.get('/analyze/status/:job_id', async (req, res, next) => {
  try {
    const { job_id } = req.params;
    const status = await getAnalysisStatus(job_id);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

export { router as analysisRoutes };

