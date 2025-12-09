/**
 * Тесты для валидации
 */
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { validateAnalysisRequest } from '../src/middleware/validator.js';

describe('Validator', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should pass validation for valid text', () => {
    req.body = {
      text: "The cat sat on the mat.",
      options: {}
    };

    validateAnalysisRequest(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should reject empty text', () => {
    req.body = {
      text: "",
      options: {}
    };

    validateAnalysisRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid request',
        message: 'Text cannot be empty'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject missing text', () => {
    req.body = {
      options: {}
    };

    validateAnalysisRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject text that is not a string', () => {
    req.body = {
      text: 123,
      options: {}
    };

    validateAnalysisRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject text exceeding max length', () => {
    const longText = "a".repeat(100001);
    req.body = {
      text: longText,
      options: { max_length: 100000 }
    };

    validateAnalysisRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Text too long'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

