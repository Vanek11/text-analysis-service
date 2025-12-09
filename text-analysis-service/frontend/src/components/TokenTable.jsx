import React, { useState } from 'react';
import './TokenTable.css';

// Цветовое кодирование POS-тегов
const POS_COLORS = {
  'NOUN': '#8e44ad',
  'VERB': '#e74c3c',
  'ADJ': '#3498db',
  'ADV': '#2ecc71',
  'PRON': '#f39c12',
  'DET': '#16a085',
  'ADP': '#9b59b6',
  'CONJ': '#e67e22',
  'NUM': '#1abc9c',
  'PUNCT': '#95a5a6',
  'X': '#7f8c8d'
};

function TokenTable({ tokens }) {
  const [filter, setFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');

  if (!tokens || tokens.length === 0) {
    return <div className="token-table-empty">No tokens to display</div>;
  }

  // Получение уникальных POS-тегов
  const uniquePos = [...new Set(tokens.map(t => t.pos))].sort();

  // Фильтрация токенов
  const filteredTokens = tokens.filter(token => {
    const matchesText = !filter || 
      token.text.toLowerCase().includes(filter.toLowerCase()) ||
      token.lemma.toLowerCase().includes(filter.toLowerCase());
    const matchesPos = !posFilter || token.pos === posFilter;
    return matchesText && matchesPos;
  });

  const getPosColor = (pos) => POS_COLORS[pos] || '#95a5a6';

  return (
    <div className="token-table">
      <div className="token-table-filters">
        <input
          type="text"
          placeholder="Search tokens..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <select
          value={posFilter}
          onChange={(e) => setPosFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All POS tags</option>
          {uniquePos.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        <span className="filter-count">
          Showing {filteredTokens.length} of {tokens.length} tokens
        </span>
      </div>

      <div className="token-table-container">
        <table className="token-table-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>Lemma</th>
              <th>POS</th>
              <th>Tag</th>
              <th>Dependency</th>
              <th>Head</th>
              <th>Grammar</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.map(token => (
              <tr key={token.id}>
                <td>{token.id}</td>
                <td className="token-text">{token.text}</td>
                <td>{token.lemma}</td>
                <td>
                  <span 
                    className="pos-tag"
                    style={{ backgroundColor: getPosColor(token.pos) }}
                  >
                    {token.pos}
                  </span>
                </td>
                <td className="tag-detail">{token.tag}</td>
                <td>{token.dependency?.dep || '-'}</td>
                <td>
                  {token.dependency?.head !== null && token.dependency?.head !== undefined
                    ? `${token.dependency.head} (${token.dependency.head_text})`
                    : '-'}
                </td>
                <td>
                  {token.grammar ? (
                    <div className="grammar-info">
                      {token.grammar.tense && <span>T: {token.grammar.tense}</span>}
                      {token.grammar.aspect && <span>A: {token.grammar.aspect}</span>}
                      {token.grammar.voice && <span>V: {token.grammar.voice}</span>}
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TokenTable;

