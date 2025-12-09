import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Анализ текста (синхронный)
 */
export async function analyzeText(text, options = {}) {
  try {
    const response = await api.post('/analyze', {
      text,
      options
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || error.response.data.error || 'Analysis failed');
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

/**
 * Асинхронный анализ текста
 */
export async function analyzeTextAsync(text, options = {}) {
  try {
    const response = await api.post('/analyze/async', {
      text,
      options
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || error.response.data.error || 'Analysis failed');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

/**
 * Получение статуса асинхронного анализа
 */
export async function getAnalysisStatus(jobId) {
  try {
    const response = await api.get(`/analyze/status/${jobId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || error.response.data.error || 'Failed to get status');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

