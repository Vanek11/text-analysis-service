import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AdjectivesTab.css';

function AdjectivesTab({ tokens }) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [filterDegree, setFilterDegree] = useState('all');
  const [searchText, setSearchText] = useState('');

  const adjectives = useMemo(() => {
    return tokens.filter(token => token.adjective_analysis);
  }, [tokens]);

  const filteredAdjectives = useMemo(() => {
    let filtered = adjectives;

    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(a => 
        a.adjective_analysis.type === filterType
      );
    }

    // Фильтр по степени
    if (filterDegree !== 'all') {
      filtered = filtered.filter(a => 
        a.adjective_analysis.degree.degree === filterDegree
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
  }, [adjectives, filterType, filterDegree, searchText]);

  const typeCounts = useMemo(() => {
    const counts = {};
    adjectives.forEach(a => {
      const type = a.adjective_analysis.type;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [adjectives]);

  const degreeCounts = useMemo(() => {
    const counts = { positive: 0, comparative: 0, superlative: 0 };
    adjectives.forEach(a => {
      const degree = a.adjective_analysis.degree.degree;
      counts[degree] = (counts[degree] || 0) + 1;
    });
    return counts;
  }, [adjectives]);

  if (adjectives.length === 0) {
    return (
      <div className="adjectives-tab">
        <div className="empty-state">
          <p>{t('noAdjectivesFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adjectives-tab">
      <div className="adjectives-header">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">{t('totalAdjectives')}:</span>
            <span className="stat-value">{adjectives.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('byType')}:</span>
            <span className="stat-value">
              {Object.keys(typeCounts).length} {t('categories')}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('positive')}:</span>
            <span className="stat-value">{degreeCounts.positive}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('comparative')}:</span>
            <span className="stat-value">{degreeCounts.comparative}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('superlative')}:</span>
            <span className="stat-value">{degreeCounts.superlative}</span>
          </div>
        </div>
      </div>

      <div className="adjectives-filters">
        <div className="filter-group">
          <label>{t('filterByType')}:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="descriptive">{t('descriptive')}</option>
            <option value="quantitative">{t('quantitative')}</option>
            <option value="demonstrative">{t('demonstrative')}</option>
            <option value="possessive">{t('possessive')}</option>
            <option value="interrogative">{t('interrogative')}</option>
            <option value="distributive">{t('distributive')}</option>
            <option value="indefinite">{t('indefinite')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('filterByDegree')}:</label>
          <select 
            value={filterDegree} 
            onChange={(e) => setFilterDegree(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allDegrees')}</option>
            <option value="positive">{t('positive')}</option>
            <option value="comparative">{t('comparative')}</option>
            <option value="superlative">{t('superlative')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('search')}:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('searchAdjectives')}
            className="filter-input"
          />
        </div>
      </div>

      <div className="adjectives-table-container">
        <table className="adjectives-table">
          <thead>
            <tr>
              <th>{t('text')}</th>
              <th>{t('lemma')}</th>
              <th>{t('type')}</th>
              <th>{t('degree')}</th>
              <th>{t('baseForm')}</th>
              <th>{t('formation')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdjectives.map((token, idx) => (
              <tr key={idx}>
                <td className="token-text">{token.text}</td>
                <td>{token.lemma}</td>
                <td>
                  <span className={`type-badge type-${token.adjective_analysis.type}`}>
                    {t(token.adjective_analysis.type)}
                  </span>
                </td>
                <td>
                  <span className={`degree-badge degree-${token.adjective_analysis.degree.degree}`}>
                    {t(token.adjective_analysis.degree.degree)}
                  </span>
                  {token.adjective_analysis.degree.is_irregular && (
                    <span className="irregular-badge">{t('irregular')}</span>
                  )}
                </td>
                <td>{token.adjective_analysis.degree.base_form}</td>
                <td>
                  <div className="formation-info">
                    <span className="formation-type">
                      {t(token.adjective_analysis.formation_rules.formation_type)}
                    </span>
                    {token.adjective_analysis.formation_rules.rules.length > 0 && (
                      <div className="formation-rules">
                        {token.adjective_analysis.formation_rules.rules.map((rule, i) => (
                          <span key={i} className="rule-badge">{rule}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAdjectives.length === 0 && (
          <div className="no-results">
            {t('noAdjectivesMatch')}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdjectivesTab;

