/**
 * Валидация входных данных для анализа
 */
export function validateAnalysisRequest(req, res, next) {
  const { text, options } = req.body;

  // Проверка наличия текста
  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Text is required and must be a string'
    });
  }

  // Проверка длины текста
  const maxLength = options?.max_length || 100000;
  if (text.length === 0) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Text cannot be empty'
    });
  }

  if (text.length > maxLength) {
    return res.status(413).json({
      error: 'Text too long',
      message: `Text exceeds maximum length of ${maxLength} characters`
    });
  }

  // Базовая проверка на английский язык (опционально)
  // Можно добавить более сложную проверку с использованием библиотеки для определения языка

  next();
}

