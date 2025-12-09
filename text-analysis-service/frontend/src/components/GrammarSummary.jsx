import React from 'react';
import './GrammarSummary.css';

function GrammarSummary({ tokens }) {
  if (!tokens || tokens.length === 0) {
    return <div className="grammar-summary-empty">No grammar data available</div>;
  }

  // Фильтрация глаголов с грамматической информацией
  const verbs = tokens.filter(t => t.grammar);

  // Статистика по временам
  const tenseStats = {};
  const aspectStats = {};
  const voiceStats = {};

  verbs.forEach(verb => {
    if (verb.grammar.tense) {
      tenseStats[verb.grammar.tense] = (tenseStats[verb.grammar.tense] || 0) + 1;
    }
    if (verb.grammar.aspect) {
      aspectStats[verb.grammar.aspect] = (aspectStats[verb.grammar.aspect] || 0) + 1;
    }
    if (verb.grammar.voice) {
      voiceStats[verb.grammar.voice] = (voiceStats[verb.grammar.voice] || 0) + 1;
    }
  });

  // Статистика по POS-тегам
  const posStats = {};
  tokens.forEach(token => {
    posStats[token.pos] = (posStats[token.pos] || 0) + 1;
  });

  return (
    <div className="grammar-summary">
      <div className="summary-section">
        <h3>Verb Grammar Analysis</h3>
        <p className="summary-count">Found {verbs.length} verb{verbs.length !== 1 ? 's' : ''} with grammar information</p>
        
        {verbs.length > 0 && (
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Tense Distribution</h4>
              <ul>
                {Object.entries(tenseStats).map(([tense, count]) => (
                  <li key={tense}>
                    <span className="stat-label">{tense}:</span>
                    <span className="stat-value">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="summary-card">
              <h4>Aspect Distribution</h4>
              <ul>
                {Object.entries(aspectStats).map(([aspect, count]) => (
                  <li key={aspect}>
                    <span className="stat-label">{aspect}:</span>
                    <span className="stat-value">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="summary-card">
              <h4>Voice Distribution</h4>
              <ul>
                {Object.entries(voiceStats).map(([voice, count]) => (
                  <li key={voice}>
                    <span className="stat-label">{voice}:</span>
                    <span className="stat-value">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {verbs.length > 0 && (
          <div className="verbs-list">
            <h4>Verb Details</h4>
            <div className="verbs-table">
              {verbs.map(verb => (
                <div key={verb.id} className="verb-item">
                  <span className="verb-text">{verb.text}</span>
                  <span className="verb-lemma">({verb.lemma})</span>
                  <div className="verb-grammar">
                    {verb.grammar.tense && (
                      <span className="grammar-badge tense">{verb.grammar.tense}</span>
                    )}
                    {verb.grammar.aspect && (
                      <span className="grammar-badge aspect">{verb.grammar.aspect}</span>
                    )}
                    {verb.grammar.voice && (
                      <span className="grammar-badge voice">{verb.grammar.voice}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="summary-section">
        <h3>POS Tag Distribution</h3>
        <div className="pos-distribution">
          {Object.entries(posStats)
            .sort((a, b) => b[1] - a[1])
            .map(([pos, count]) => (
              <div key={pos} className="pos-stat-item">
                <span className="pos-name">{pos}</span>
                <div className="pos-bar-container">
                  <div 
                    className="pos-bar"
                    style={{ width: `${(count / tokens.length) * 100}%` }}
                  />
                </div>
                <span className="pos-count">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default GrammarSummary;

