import Bull from 'bull';
import { nlpService } from './nlpService.js';
import { cacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Создание очереди для асинхронной обработки
export const analysisQueue = new Bull('text-analysis', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});

// Обработчик задач
analysisQueue.process(async (job) => {
  const { text, options } = job.data;
  
  logger.info('Processing analysis job', { jobId: job.id, textLength: text.length });
  
  try {
    // Проверка кэша
    const cached = await cacheService.get(text);
    if (cached) {
      logger.info('Using cached result', { jobId: job.id });
      return cached;
    }
    
    // Анализ через NLP сервис
    const result = await nlpService.analyze(text, options);
    
    // Сохранение в кэш
    await cacheService.set(text, result);
    
    logger.info('Analysis job completed', { jobId: job.id });
    
    return result;
  } catch (error) {
    logger.error('Analysis job failed', { jobId: job.id, error: error.message });
    throw error;
  }
});

// Обработка событий очереди
analysisQueue.on('completed', (job, result) => {
  logger.info('Job completed', { jobId: job.id });
});

analysisQueue.on('failed', (job, err) => {
  logger.error('Job failed', { jobId: job.id, error: err.message });
});

analysisQueue.on('error', (error) => {
  logger.error('Queue error', { error: error.message });
});

/**
 * Получение статуса задачи
 */
export async function getJobStatus(jobId) {
  try {
    const job = await analysisQueue.getJob(jobId);
    
    if (!job) {
      return { status: 'not_found' };
    }
    
    const state = await job.getState();
    
    if (state === 'completed') {
      const result = await job.returnvalue;
      return {
        status: 'completed',
        result
      };
    } else if (state === 'failed') {
      return {
        status: 'failed',
        error: job.failedReason
      };
    } else {
      return {
        status: state
      };
    }
  } catch (error) {
    logger.error('Error getting job status', { error: error.message });
    throw error;
  }
}

