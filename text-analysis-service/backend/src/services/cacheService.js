import { createClient } from 'redis';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Подключение к Redis
   */
  async connect() {
    try {
      this.client = createClient({
        socket: {
          host: REDIS_HOST,
          port: REDIS_PORT
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error', { error: err.message });
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis', { error: error.message });
      this.isConnected = false;
    }
  }

  /**
   * Генерация ключа кэша на основе текста
   */
  generateKey(text) {
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    return `analysis:${hash}`;
  }

  /**
   * Получение из кэша
   */
  async get(text) {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const key = this.generateKey(text);
      const cached = await this.client.get(key);
      
      if (cached) {
        logger.info('Cache hit', { key });
        return JSON.parse(cached);
      }
      
      return null;
    } catch (error) {
      logger.error('Cache get error', { error: error.message });
      return null;
    }
  }

  /**
   * Сохранение в кэш
   */
  async set(text, data, ttl = 3600) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const key = this.generateKey(text);
      await this.client.setEx(key, ttl, JSON.stringify(data));
      logger.info('Cache set', { key, ttl });
      return true;
    } catch (error) {
      logger.error('Cache set error', { error: error.message });
      return false;
    }
  }

  /**
   * Удаление из кэша
   */
  async delete(text) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const key = this.generateKey(text);
      await this.client.del(key);
      logger.info('Cache delete', { key });
      return true;
    } catch (error) {
      logger.error('Cache delete error', { error: error.message });
      return false;
    }
  }
}

export const cacheService = new CacheService();

// Подключение при старте
cacheService.connect().catch(err => {
  logger.error('Failed to initialize cache service', { error: err.message });
});

