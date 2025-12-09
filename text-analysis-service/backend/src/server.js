import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analysisRoutes } from './routes/analysis.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', analysisRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Проверка доступности NLP сервиса
    const nlpServiceUrl = process.env.NLP_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${nlpServiceUrl}/health`);
    
    if (response.ok) {
      res.json({ 
        status: 'ok',
        services: {
          backend: 'healthy',
          nlp: 'healthy'
        }
      });
    } else {
      res.status(503).json({ 
        status: 'degraded',
        services: {
          backend: 'healthy',
          nlp: 'unhealthy'
        }
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'degraded',
      services: {
        backend: 'healthy',
        nlp: 'unavailable'
      },
      error: error.message
    });
  }
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}`);
});

