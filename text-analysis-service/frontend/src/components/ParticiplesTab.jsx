import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ParticiplesTab.css';

function ParticiplesTab({ tokens }) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchText, setSearchText] = useState('');

  const participles = useMemo(() => {
    return tokens.filter(token => token.participle);
  }, [tokens]);

  const filteredParticiples = useMemo(() => {
    let filtered = participles;

    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.participle.type === filterType);
    }

    // Фильтр по роли
    if (filterRole !== 'all') {
      filtered = filtered.filter(p => 
        p.participle.roles.includes(filterRole)
      );
    }

    // Поиск по тексту
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(p => 
        p.text.toLowerCase().includes(searchLower) ||
        p.lemma.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [participles, filterType, filterRole, searchText]);

  const typeCounts = useMemo(() => {
    const counts = { present: 0, past: 0 };
    participles.forEach(p => {
      if (p.participle.type === 'present') counts.present++;
      else if (p.participle.type === 'past') counts.past++;
    });
    return counts;
  }, [participles]);

  const roleCounts = useMemo(() => {
    const counts = {};
    participles.forEach(p => {
      p.participle.roles.forEach(role => {
        counts[role] = (counts[role] || 0) + 1;
      });
    });
    return counts;
  }, [participles]);

  if (participles.length === 0) {
    return (
      <div className="participles-tab">
        <div className="empty-state">
          <p>{t('noParticiplesFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="participles-tab">
      <div className="participles-header">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">{t('totalParticiples')}:</span>
            <span className="stat-value">{participles.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('presentParticiples')}:</span>
            <span className="stat-value">{typeCounts.present}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('pastParticiples')}:</span>
            <span className="stat-value">{typeCounts.past}</span>
          </div>
        </div>
      </div>

      <div className="participles-filters">
        <div className="filter-group">
          <label>{t('filterByType')}:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="present">{t('present')}</option>
            <option value="past">{t('past')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('filterByRole')}:</label>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allRoles')}</option>
            <option value="progressive_tense">{t('progressiveTense')}</option>
            <option value="perfect_tense">{t('perfectTense')}</option>
            <option value="passive_voice">{t('passiveVoice')}</option>
            <option value="adjective">{t('adjective')}</option>
            <option value="gerund">{t('gerund')}</option>
            <option value="absolute_construction">{t('absoluteConstruction')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('search')}:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('searchParticiples')}
            className="filter-input"
          />
        </div>
      </div>

      <div className="participles-table-container">
        <table className="participles-table">
          <thead>
            <tr>
              <th>{t('text')}</th>
              <th>{t('lemma')}</th>
              <th>{t('type')}</th>
              <th>{t('roles')}</th>
              <th>{t('pos')}</th>
              <th>{t('sentence')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticiples.map((token, idx) => (
              <tr key={idx}>
                <td className="token-text">{token.text}</td>
                <td>{token.lemma}</td>
                <td>
                  <span className={`type-badge type-${token.participle.type}`}>
                    {t(token.participle.type)}
                  </span>
                </td>
                <td>
                  <div className="roles-list">
                    {token.participle.roles.map((role, i) => (
                      <span key={i} className="role-badge">
                        {t(role)}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{token.pos}</td>
                <td className="sentence-preview">
                  {token.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredParticiples.length === 0 && (
          <div className="no-results">
            {t('noParticiplesMatch')}
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticiplesTab;

