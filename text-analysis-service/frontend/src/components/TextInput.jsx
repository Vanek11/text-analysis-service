import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './TextInput.css';

function TextInput({ text, onTextChange, onAnalyze, loading }) {
  const { t } = useLanguage();
  const [options, setOptions] = useState({
    include_morphology: true,
    include_entities: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) {
      onAnalyze(text, options);
    }
  };

  const handleClear = () => {
    onTextChange('');
  };

  const textLength = text.length;
  const maxLength = 10000;
  const isOverLimit = textLength > maxLength;

  return (
    <form onSubmit={handleSubmit} className="text-input-form">
      <div className="text-input-header">
        <label htmlFor="text-input">
          <strong>{t('enterText')}</strong>
        </label>
        <div className="text-input-stats">
          <span className={isOverLimit ? 'text-over-limit' : ''}>
            {textLength.toLocaleString()} / {maxLength.toLocaleString()} {t('characters')}
          </span>
        </div>
      </div>
      
      <textarea
        id="text-input"
        className="text-input-area"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={t('placeholder')}
        rows={10}
        disabled={loading}
      />

      <div className="text-input-options">
        <label>
          <input
            type="checkbox"
            checked={options.include_morphology}
            onChange={(e) => setOptions({ ...options, include_morphology: e.target.checked })}
            disabled={loading}
          />
          {t('includeMorphology')}
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.include_entities}
            onChange={(e) => setOptions({ ...options, include_entities: e.target.checked })}
            disabled={loading}
          />
          {t('includeEntities')}
        </label>
      </div>

      <div className="text-input-actions">
        <button
          type="button"
          onClick={handleClear}
          disabled={loading || !text}
          className="btn btn-secondary"
        >
          {t('clear')}
        </button>
        <button
          type="submit"
          disabled={loading || !text.trim() || isOverLimit}
          className="btn btn-primary"
        >
          {loading ? t('analyzing') : t('analyzeText')}
        </button>
      </div>

      {isOverLimit && (
        <div className="text-input-warning">
          {t('textTooLong')}
        </div>
      )}
    </form>
  );
}

export default TextInput;

