import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import TokenTable from './TokenTable';
import DependencyTree from './DependencyTree';
import GrammarSummary from './GrammarSummary';
import './AnalysisResults.css';

function AnalysisResults({ results }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tokens');

  if (!results) {
    return null;
  }

  return (
    <div className="analysis-results">
      <h2>{t('analysisResults')}</h2>
      
      <div className="results-tabs">
        <button
          className={activeTab === 'tokens' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tokens')}
        >
          {t('tokens')} ({results.tokens?.length || 0})
        </button>
        <button
          className={activeTab === 'tree' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tree')}
        >
          {t('dependencyTree')}
        </button>
        <button
          className={activeTab === 'grammar' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('grammar')}
        >
          {t('grammarSummary')}
        </button>
      </div>

      <div className="results-content">
        {activeTab === 'tokens' && <TokenTable tokens={results.tokens} />}
        {activeTab === 'tree' && (
          <DependencyTree 
            tree={results.dependency_tree}
            tokens={results.tokens}
          />
        )}
        {activeTab === 'grammar' && <GrammarSummary tokens={results.tokens} />}
      </div>
    </div>
  );
}

export default AnalysisResults;

