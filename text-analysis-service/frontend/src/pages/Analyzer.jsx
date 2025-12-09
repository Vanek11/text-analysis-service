import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import TextInput from '../components/TextInput';
import AnalysisResults from '../components/AnalysisResults';
import { analyzeText } from '../services/api';
import './Analyzer.css';

function Analyzer() {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (inputText, options) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeText(inputText, options);
      setResults(data);
    } catch (err) {
      setError(err.message || t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer-container">
      <div className="analyzer-input-section">
        <TextInput
          text={text}
          onTextChange={setText}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
        {error && (
          <div className="error-message">
            <strong>{t('error')}:</strong> {error}
          </div>
        )}
      </div>

      {results && (
        <div className="analyzer-results-section">
          <AnalysisResults results={results} />
        </div>
      )}
    </div>
  );
}

export default Analyzer;

