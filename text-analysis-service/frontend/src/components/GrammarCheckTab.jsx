import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './GrammarCheckTab.css';

function GrammarCheckTab({ tokens, grammarErrors, sentences }) {
  const { t } = useLanguage();

  const errorsByType = useMemo(() => {
    if (!grammarErrors) return {};
    const grouped = {};
    grammarErrors.forEach(error => {
      if (!grouped[error.type]) {
        grouped[error.type] = [];
      }
      grouped[error.type].push(error);
    });
    return grouped;
  }, [grammarErrors]);

  const errorsBySeverity = useMemo(() => {
    if (!grammarErrors) return { error: [], warning: [] };
    return {
      error: grammarErrors.filter(e => e.severity === 'error'),
      warning: grammarErrors.filter(e => e.severity === 'warning')
    };
  }, [grammarErrors]);

  const getErrorTypeLabel = (type) => {
    const labels = {
      'subject_verb_agreement': t('subjectVerbAgreement'),
      'article_usage': t('articleUsage'),
      'tense_consistency': t('tenseConsistency')
    };
    return labels[type] || type;
  };

  const getTokenText = (tokenId) => {
    if (tokenId === null || tokenId === undefined) return null;
    const token = tokens?.find(t => t.id === tokenId);
    return token ? token.text : null;
  };

  if (!grammarErrors || grammarErrors.length === 0) {
    return (
      <div className="grammar-check-tab">
        <div className="grammar-check-header success">
          <h3>{t('grammarCheck')}</h3>
          <div className="success-message">
            <span className="success-icon">✓</span>
            <p>{t('noGrammarErrors')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grammar-check-tab">
      <div className="grammar-check-header">
        <h3>{t('grammarCheck')}</h3>
        <div className="error-summary">
          <div className="summary-item error">
            <span className="summary-label">{t('errors')}:</span>
            <span className="summary-value">{errorsBySeverity.error.length}</span>
          </div>
          <div className="summary-item warning">
            <span className="summary-label">{t('warnings')}:</span>
            <span className="summary-value">{errorsBySeverity.warning.length}</span>
          </div>
          <div className="summary-item total">
            <span className="summary-label">{t('total')}:</span>
            <span className="summary-value">{grammarErrors.length}</span>
          </div>
        </div>
      </div>

      <div className="grammar-errors-list">
        {Object.entries(errorsByType).map(([type, errors]) => (
          <div key={type} className="error-group">
            <h4 className="error-group-title">
              {getErrorTypeLabel(type)}
              <span className="error-count">({errors.length})</span>
            </h4>
            <div className="errors-container">
              {errors.map((error, idx) => (
                <div key={idx} className={`error-item ${error.severity}`}>
                  <div className="error-header">
                    <span className={`severity-badge ${error.severity}`}>
                      {error.severity === 'error' ? t('error') : t('warning')}
                    </span>
                    <span className="error-type">{getErrorTypeLabel(error.type)}</span>
                  </div>
                  <div className="error-message">
                    {error.message}
                  </div>
                  {error.token_id !== null && error.token_id !== undefined && (
                    <div className="error-token">
                      <strong>{t('token')}:</strong> {getTokenText(error.token_id)}
                      {error.subject_id !== null && error.subject_id !== undefined && (
                        <span className="subject-token">
                          {' / '}
                          <strong>{t('subject')}:</strong> {getTokenText(error.subject_id)}
                        </span>
                      )}
                    </div>
                  )}
                  {error.sentence && (
                    <div className="error-sentence">
                      <strong>{t('sentence')}:</strong> "{error.sentence}"
                    </div>
                  )}
                  {error.suggestion && (
                    <div className="error-suggestion">
                      <strong>{t('suggestion')}:</strong> {error.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GrammarCheckTab;

