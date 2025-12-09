import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './PrepositionsTab.css';

function PrepositionsTab({ tokens, nestedPrepositionalPhrases }) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [searchText, setSearchText] = useState('');

  const prepositions = useMemo(() => {
    return tokens.filter(token => token.preposition_analysis);
  }, [tokens]);

  const filteredPrepositions = useMemo(() => {
    let filtered = prepositions;

    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(p => 
        p.preposition_analysis.type === filterType
      );
    }

    // Поиск по тексту
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(p => 
        p.text.toLowerCase().includes(searchLower) ||
        p.lemma.toLowerCase().includes(searchLower) ||
        (p.preposition_analysis.prepositional_phrase.full_phrase && 
         p.preposition_analysis.prepositional_phrase.full_phrase.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [prepositions, filterType, searchText]);

  const typeCounts = useMemo(() => {
    const counts = {};
    prepositions.forEach(p => {
      const type = p.preposition_analysis.type;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [prepositions]);

  if (prepositions.length === 0) {
    return (
      <div className="prepositions-tab">
        <div className="empty-state">
          <p>{t('noPrepositionsFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prepositions-tab">
      <div className="prepositions-header">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">{t('totalPrepositions')}:</span>
            <span className="stat-value">{prepositions.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('byType')}:</span>
            <span className="stat-value">
              {Object.keys(typeCounts).length} {t('categories')}
            </span>
          </div>
          {nestedPrepositionalPhrases && nestedPrepositionalPhrases.length > 0 && (
            <div className="stat-item">
              <span className="stat-label">{t('nestedPhrases')}:</span>
              <span className="stat-value">{nestedPrepositionalPhrases.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="prepositions-filters">
        <div className="filter-group">
          <label>{t('filterByType')}:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="time">{t('time')}</option>
            <option value="place">{t('place')}</option>
            <option value="direction">{t('direction')}</option>
            <option value="agent">{t('agent')}</option>
            <option value="instrument">{t('instrument')}</option>
            <option value="purpose">{t('purpose')}</option>
            <option value="possession">{t('possession')}</option>
            <option value="manner">{t('manner')}</option>
            <option value="cause">{t('cause')}</option>
            <option value="concession">{t('concession')}</option>
            <option value="exception">{t('exception')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('search')}:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('searchPrepositions')}
            className="filter-input"
          />
        </div>
      </div>

      {nestedPrepositionalPhrases && nestedPrepositionalPhrases.length > 0 && (
        <div className="nested-phrases-section">
          <h3>{t('nestedPrepositionalPhrases')}</h3>
          <div className="nested-phrases-list">
            {nestedPrepositionalPhrases.map((phrase, idx) => (
              <div key={idx} className="nested-phrase-card">
                <div className="nested-phrase-structure">
                  <span className="outer-prep">{phrase.outer_preposition}</span>
                  <span className="outer-obj">{phrase.outer_object}</span>
                  <span className="arrow">→</span>
                  <span className="inner-prep">{phrase.inner_preposition}</span>
                  {phrase.inner_object && (
                    <span className="inner-obj">{phrase.inner_object}</span>
                  )}
                </div>
                <div className="nested-phrase-sentence">
                  "{phrase.sentence}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prepositions-table-container">
        <table className="prepositions-table">
          <thead>
            <tr>
              <th>{t('preposition')}</th>
              <th>{t('type')}</th>
              <th>{t('prepositionalPhrase')}</th>
              <th>{t('object')}</th>
              <th>{t('multiword')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrepositions.map((token, idx) => (
              <tr key={idx}>
                <td className="token-text">{token.text}</td>
                <td>
                  <span className={`type-badge type-${token.preposition_analysis.type}`}>
                    {t(token.preposition_analysis.type)}
                  </span>
                </td>
                <td className="phrase-cell">
                  {token.preposition_analysis.prepositional_phrase.full_phrase || '-'}
                </td>
                <td>
                  {token.preposition_analysis.prepositional_phrase.object ? (
                    <span>
                      {token.preposition_analysis.prepositional_phrase.object}
                      <span className="object-pos">
                        ({token.preposition_analysis.prepositional_phrase.object_pos})
                      </span>
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {token.preposition_analysis.is_multiword ? (
                    <span className="multiword-badge">{t('yes')}</span>
                  ) : (
                    <span className="singleword-badge">{t('no')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPrepositions.length === 0 && (
          <div className="no-results">
            {t('noPrepositionsMatch')}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrepositionsTab;

