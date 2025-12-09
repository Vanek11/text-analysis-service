import axios from 'axios';
import { logger } from '../utils/logger.js';

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:8000';

/**
 * Клиент для взаимодействия с Python NLP сервисом
 */
class NLPServiceClient {
  constructor(baseURL = NLP_SERVICE_URL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 секунд
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Анализ текста
   */
  async analyze(text, options = {}) {
    try {
      logger.info('Sending request to NLP service', { textLength: text.length });
      
      const response = await this.client.post('/analyze', {
        text,
        options
      });
      
      logger.info('Received response from NLP service', { 
        tokensCount: response.data.tokens?.length 
      });
      
      return response.data;
    } catch (error) {
      logger.error('NLP service error', { 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response) {
        // Сервер вернул ошибку
        throw new Error(`NLP service error: ${error.response.data.detail || error.message}`);
      } else if (error.request) {
        // Запрос был отправлен, но ответа не получено
        throw new Error('NLP service unavailable');
      } else {
        // Ошибка при настройке запроса
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'unhealthy' };
    }
  }
}

export const nlpService = new NLPServiceClient();

