import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AdverbsTab.css';

function AdverbsTab({ tokens }) {
  const { t } = useLanguage();
  const [filterSemantic, setFilterSemantic] = useState('all');
  const [filterMorphological, setFilterMorphological] = useState('all');
  const [searchText, setSearchText] = useState('');

  const adverbs = useMemo(() => {
    return tokens.filter(token => token.adverb_classification);
  }, [tokens]);

  const filteredAdverbs = useMemo(() => {
    let filtered = adverbs;

    // Фильтр по семантике
    if (filterSemantic !== 'all') {
      filtered = filtered.filter(a => 
        a.adverb_classification.semantic === filterSemantic
      );
    }

    // Фильтр по морфологии
    if (filterMorphological !== 'all') {
      filtered = filtered.filter(a => 
        a.adverb_classification.morphological === filterMorphological
      );
    }

    // Поиск по тексту
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(a => 
        a.text.toLowerCase().includes(searchLower) ||
        a.lemma.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [adverbs, filterSemantic, filterMorphological, searchText]);

  const semanticCounts = useMemo(() => {
    const counts = {};
    adverbs.forEach(a => {
      const sem = a.adverb_classification.semantic;
      counts[sem] = (counts[sem] || 0) + 1;
    });
    return counts;
  }, [adverbs]);

  const morphologicalCounts = useMemo(() => {
    const counts = {};
    adverbs.forEach(a => {
      const morph = a.adverb_classification.morphological;
      counts[morph] = (counts[morph] || 0) + 1;
    });
    return counts;
  }, [adverbs]);

  if (adverbs.length === 0) {
    return (
      <div className="adverbs-tab">
        <div className="empty-state">
          <p>{t('noAdverbsFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adverbs-tab">
      <div className="adverbs-header">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">{t('totalAdverbs')}:</span>
            <span className="stat-value">{adverbs.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('bySemantic')}:</span>
            <span className="stat-value">
              {Object.keys(semanticCounts).length} {t('categories')}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('byMorphological')}:</span>
            <span className="stat-value">
              {Object.keys(morphologicalCounts).length} {t('types')}
            </span>
          </div>
        </div>
      </div>

      <div className="adverbs-filters">
        <div className="filter-group">
          <label>{t('filterBySemantic')}:</label>
          <select 
            value={filterSemantic} 
            onChange={(e) => setFilterSemantic(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allSemantic')}</option>
            <option value="manner">{t('manner')}</option>
            <option value="time">{t('time')}</option>
            <option value="place">{t('place')}</option>
            <option value="frequency">{t('frequency')}</option>
            <option value="degree">{t('degree')}</option>
            <option value="sentence">{t('sentence')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('filterByMorphological')}:</label>
          <select 
            value={filterMorphological} 
            onChange={(e) => setFilterMorphological(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allMorphological')}</option>
            <option value="simple">{t('simple')}</option>
            <option value="derived">{t('derived')}</option>
            <option value="compound">{t('compound')}</option>
            <option value="phrasal">{t('phrasal')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('search')}:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('searchAdverbs')}
            className="filter-input"
          />
        </div>
      </div>

      <div className="adverbs-visualization-section">
        <h4>{t('adverbRelations')}</h4>
        <div className="adverb-relations">
          {filteredAdverbs
            .filter(a => a.adverb_classification.modifies)
            .map((token, idx) => (
              <div key={idx} className="adverb-relation-item">
                <div className="adverb-node">
                  <span className="adverb-text">{token.text}</span>
                  <span className="adverb-type">{t(token.adverb_classification.semantic)}</span>
                </div>
                <div className="relation-arrow">→</div>
                <div className="modified-node">
                  <span className="modified-text">{token.adverb_classification.modifies.text}</span>
                  <span className="modified-pos">{token.adverb_classification.modifies.pos}</span>
                </div>
              </div>
            ))}
          {filteredAdverbs.filter(a => a.adverb_classification.modifies).length === 0 && (
            <div className="no-relations">{t('noAdverbRelations')}</div>
          )}
        </div>
      </div>

      <div className="adverbs-table-container">
        <table className="adverbs-table">
          <thead>
            <tr>
              <th>{t('text')}</th>
              <th>{t('lemma')}</th>
              <th>{t('semantic')}</th>
              <th>{t('morphological')}</th>
              <th>{t('position')}</th>
              <th>{t('modifies')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdverbs.map((token, idx) => (
              <tr key={idx}>
                <td className="token-text">{token.text}</td>
                <td>{token.lemma}</td>
                <td>
                  <span className={`semantic-badge semantic-${token.adverb_classification.semantic}`}>
                    {t(token.adverb_classification.semantic)}
                  </span>
                </td>
                <td>
                  <span className={`morphological-badge morphological-${token.adverb_classification.morphological}`}>
                    {t(token.adverb_classification.morphological)}
                  </span>
                </td>
                <td>
                  <span className="position-badge">
                    {t(token.adverb_classification.position)}
                  </span>
                </td>
                <td>
                  {token.adverb_classification.modifies ? (
                    <span className="modifies-info">
                      {token.adverb_classification.modifies.text} ({token.adverb_classification.modifies.pos})
                    </span>
                  ) : (
                    <span className="no-modifies">{t('sentenceLevel')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAdverbs.length === 0 && (
          <div className="no-results">
            {t('noAdverbsMatch')}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdverbsTab;

