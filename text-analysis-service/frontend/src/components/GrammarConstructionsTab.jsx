import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './GrammarConstructionsTab.css';

function GrammarConstructionsTab({ grammarConstructions, sentences }) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredConstructions = useMemo(() => {
    if (!grammarConstructions) return [];
    
    let filtered = grammarConstructions;

    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType);
    }

    // Поиск по тексту
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(c => 
        c.sentence.toLowerCase().includes(searchLower) ||
        (c.verb && c.verb.toLowerCase().includes(searchLower)) ||
        (c.tense_name && c.tense_name.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [grammarConstructions, filterType, searchText]);

  const constructionsByType = useMemo(() => {
    if (!grammarConstructions) return {};
    const grouped = {};
    grammarConstructions.forEach(c => {
      if (!grouped[c.type]) {
        grouped[c.type] = [];
      }
      grouped[c.type].push(c);
    });
    return grouped;
  }, [grammarConstructions]);

  if (!grammarConstructions || grammarConstructions.length === 0) {
    return (
      <div className="grammar-constructions-tab">
        <div className="empty-state">
          <p>{t('noGrammarConstructionsFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grammar-constructions-tab">
      <div className="constructions-header">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">{t('totalConstructions')}:</span>
            <span className="stat-value">{grammarConstructions.length}</span>
          </div>
          {Object.entries(constructionsByType).map(([type, items]) => (
            <div key={type} className="stat-item">
              <span className="stat-label">{t(type)}:</span>
              <span className="stat-value">{items.length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="constructions-filters">
        <div className="filter-group">
          <label>{t('filterByType')}:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="tense">{t('tenses')}</option>
            <option value="conditional">{t('conditionals')}</option>
            <option value="reported_speech">{t('reportedSpeech')}</option>
            <option value="passive_voice">{t('passiveVoice')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('search')}:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('searchConstructions')}
            className="filter-input"
          />
        </div>
      </div>

      <div className="constructions-list">
        {Object.entries(constructionsByType).map(([type, constructions]) => (
          <div key={type} className="construction-group">
            <h3 className="group-title">
              {t(type)}
              <span className="group-count">({constructions.length})</span>
            </h3>
            <div className="constructions-container">
              {constructions
                .filter(c => filterType === 'all' || c.type === filterType)
                .filter(c => {
                  if (!searchText) return true;
                  const searchLower = searchText.toLowerCase();
                  return c.sentence.toLowerCase().includes(searchLower) ||
                         (c.verb && c.verb.toLowerCase().includes(searchLower)) ||
                         (c.tense_name && c.tense_name.toLowerCase().includes(searchLower));
                })
                .map((construction, idx) => (
                  <ConstructionCard key={idx} construction={construction} t={t} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConstructionCard({ construction, t }) {
  const getConstructionDetails = () => {
    switch (construction.type) {
      case 'tense':
        return (
          <div className="construction-details">
            <div className="detail-item">
              <strong>{t('tense')}:</strong> {construction.tense_name || `${construction.tense} ${construction.aspect}`}
            </div>
            {construction.verb && (
              <div className="detail-item">
                <strong>{t('verb')}:</strong> <span className="highlight">{construction.verb}</span>
              </div>
            )}
            <div className="detail-item">
              <strong>{t('voice')}:</strong> {t(construction.voice || 'active')}
            </div>
          </div>
        );
      
      case 'conditional':
        return (
          <div className="construction-details">
            <div className="detail-item">
              <strong>{t('conditionalType')}:</strong> {t(construction.conditional_type || 'unknown')}
            </div>
          </div>
        );
      
      case 'reported_speech':
        return (
          <div className="construction-details">
            <div className="detail-item">
              <strong>{t('reportingVerb')}:</strong> <span className="highlight">{construction.reporting_verb}</span>
            </div>
          </div>
        );
      
      case 'passive_voice':
        return (
          <div className="construction-details">
            {construction.verb && (
              <div className="detail-item">
                <strong>{t('verb')}:</strong> <span className="highlight">{construction.verb}</span>
              </div>
            )}
            {construction.tense && (
              <div className="detail-item">
                <strong>{t('tense')}:</strong> {construction.tense}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`construction-card construction-${construction.type}`}>
      <div className="construction-header">
        <span className={`construction-type-badge type-${construction.type}`}>
          {t(construction.type)}
        </span>
      </div>
      {getConstructionDetails()}
      <div className="construction-sentence">
        <strong>{t('sentence')}:</strong> "{construction.sentence}"
      </div>
    </div>
  );
}

export default GrammarConstructionsTab;

