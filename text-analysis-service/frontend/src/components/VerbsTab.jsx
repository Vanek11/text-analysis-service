import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './VerbsTab.css';

function VerbsTab({ tokens }) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [searchText, setSearchText] = useState('');

  const verbs = useMemo(() => {
    return tokens.filter(token => token.pos === 'VERB');
  }, [tokens]);

  const filteredVerbs = useMemo(() => {
    let filtered = verbs;

    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(v => {
        if (!v.verb_type) return filterType === 'regular';
        return v.verb_type.type === filterType;
      });
    }

    // Поиск по тексту
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(v => 
        v.text.toLowerCase().includes(searchLower) ||
        v.lemma.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [verbs, filterType, searchText]);

  const typeCounts = useMemo(() => {
    const counts = { regular: 0, modal: 0, auxiliary: 0, phrasal: 0 };
    verbs.forEach(v => {
      if (!v.verb_type || v.verb_type.type === 'regular') {
        counts.regular++;
      } else {
        counts[v.verb_type.type] = (counts[v.verb_type.type] || 0) + 1;
      }
    });
    return counts;
  }, [verbs]);

  if (verbs.length === 0) {
    return (
      <div className="verbs-tab">
        <div className="empty-state">
          <p>{t('noVerbsFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verbs-tab">
      <div className="verbs-header">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">{t('totalVerbs')}:</span>
            <span className="stat-value">{verbs.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('regular')}:</span>
            <span className="stat-value">{typeCounts.regular}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('modal')}:</span>
            <span className="stat-value">{typeCounts.modal}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('auxiliary')}:</span>
            <span className="stat-value">{typeCounts.auxiliary}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('phrasal')}:</span>
            <span className="stat-value">{typeCounts.phrasal}</span>
          </div>
        </div>
      </div>

      <div className="verbs-filters">
        <div className="filter-group">
          <label>{t('filterByType')}:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="regular">{t('regular')}</option>
            <option value="modal">{t('modal')}</option>
            <option value="auxiliary">{t('auxiliary')}</option>
            <option value="phrasal">{t('phrasal')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('search')}:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('searchVerbs')}
            className="filter-input"
          />
        </div>
      </div>

      <div className="verbs-table-container">
        <table className="verbs-table">
          <thead>
            <tr>
              <th>{t('text')}</th>
              <th>{t('lemma')}</th>
              <th>{t('type')}</th>
              <th>{t('grammar')}</th>
              <th>{t('details')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredVerbs.map((token, idx) => (
              <tr key={idx}>
                <td className="token-text">{token.text}</td>
                <td>{token.lemma}</td>
                <td>
                  {token.verb_type ? (
                    <span className={`type-badge type-${token.verb_type.type}`}>
                      {t(token.verb_type.type)}
                    </span>
                  ) : (
                    <span className="type-badge type-regular">
                      {t('regular')}
                    </span>
                  )}
                </td>
                <td>
                  {token.grammar && (
                    <div className="grammar-info">
                      {token.grammar.tense && (
                        <span className="grammar-badge">
                          {t('tense')}: {t(token.grammar.tense)}
                        </span>
                      )}
                      {token.grammar.aspect && (
                        <span className="grammar-badge">
                          {t('aspect')}: {t(token.grammar.aspect)}
                        </span>
                      )}
                      {token.grammar.voice && (
                        <span className="grammar-badge">
                          {t('voice')}: {t(token.grammar.voice)}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="verb-details">
                  {token.verb_type && (
                    <div className="verb-type-details">
                      {token.verb_type.type === 'modal' && token.verb_type.modal && (
                        <div className="modal-details">
                          <strong>{t('modalVerb')}:</strong> {token.verb_type.modal.verb}
                          <div className="meanings">
                            {Object.entries(token.verb_type.modal.meanings)
                              .filter(([_, value]) => value)
                              .map(([key, _]) => (
                                <span key={key} className="meaning-badge">
                                  {t(key)}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                      {token.verb_type.type === 'auxiliary' && (
                        <div className="auxiliary-details">
                          <strong>{t('auxiliaryType')}:</strong> {token.verb_type.auxiliary_type}
                        </div>
                      )}
                      {token.verb_type.type === 'phrasal' && token.verb_type.phrasal && (
                        <div className="phrasal-details">
                          <strong>{t('phrasalVerb')}:</strong> {token.verb_type.phrasal.full_form}
                          {token.verb_type.phrasal.separable && (
                            <span className="separable-badge">{t('separable')}</span>
                          )}
                          {token.verb_type.phrasal.meaning && (
                            <div className="phrasal-meaning">
                              {t('meaning')}: {token.verb_type.phrasal.meaning}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVerbs.length === 0 && (
          <div className="no-results">
            {t('noVerbsMatch')}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerbsTab;

