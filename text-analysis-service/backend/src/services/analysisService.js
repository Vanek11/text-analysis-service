import { nlpService } from './nlpService.js';
import { cacheService } from './cacheService.js';
import { analysisQueue, getJobStatus } from './queueService.js';
import { logger } from '../utils/logger.js';

const MAX_SYNC_LENGTH = 10000; // Максимальная длина для синхронной обработки

/**
 * Синхронный анализ текста
 */
export async function analyzeText(text, options = {}) {
  // Проверка длины текста
  if (text.length > MAX_SYNC_LENGTH) {
    throw new Error(`Text too long for synchronous processing. Maximum length: ${MAX_SYNC_LENGTH} characters. Use async endpoint instead.`);
  }

  // Проверка кэша
  const cached = await cacheService.get(text);
  if (cached) {
    logger.info('Returning cached result');
    return cached;
  }

  // Анализ через NLP сервис
  const result = await nlpService.analyze(text, options);

  // Сохранение в кэш
  await cacheService.set(text, result);

  return result;
}

/**
 * Асинхронный анализ текста
 */
export async function analyzeTextAsync(text, options = {}) {
  // Добавление задачи в очередь
  const job = await analysisQueue.add({
    text,
    options
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });

  logger.info('Analysis job queued', { jobId: job.id });

  return job;
}

/**
 * Получение статуса анализа
 */
export async function getAnalysisStatus(jobId) {
  return await getJobStatus(jobId);
}

