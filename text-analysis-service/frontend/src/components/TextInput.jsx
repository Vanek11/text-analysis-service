import React, { useState } from 'react';
import './TextInput.css';

function TextInput({ text, onTextChange, onAnalyze, loading }) {
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
          <strong>Enter English text to analyze:</strong>
        </label>
        <div className="text-input-stats">
          <span className={isOverLimit ? 'text-over-limit' : ''}>
            {textLength.toLocaleString()} / {maxLength.toLocaleString()} characters
          </span>
        </div>
      </div>
      
      <textarea
        id="text-input"
        className="text-input-area"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter your English text here..."
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
          Include morphology
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.include_entities}
            onChange={(e) => setOptions({ ...options, include_entities: e.target.checked })}
            disabled={loading}
          />
          Include named entities
        </label>
      </div>

      <div className="text-input-actions">
        <button
          type="button"
          onClick={handleClear}
          disabled={loading || !text}
          className="btn btn-secondary"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={loading || !text.trim() || isOverLimit}
          className="btn btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>

      {isOverLimit && (
        <div className="text-input-warning">
          Text exceeds maximum length. Please use the async endpoint for longer texts.
        </div>
      )}
    </form>
  );
}

export default TextInput;

