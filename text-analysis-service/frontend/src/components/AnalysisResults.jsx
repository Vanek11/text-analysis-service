import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import TokenTable from './TokenTable';
import DependencyTree from './DependencyTree';
import GrammarSummary from './GrammarSummary';
import ParticiplesTab from './ParticiplesTab';
import AdverbsTab from './AdverbsTab';
import VerbsTab from './VerbsTab';
import AdjectivesTab from './AdjectivesTab';
import GrammarConstructionsTab from './GrammarConstructionsTab';
import PrepositionsTab from './PrepositionsTab';
import ComplexityAnalysisTab from './ComplexityAnalysisTab';
import StatisticsTab from './StatisticsTab';
import GrammarCheckTab from './GrammarCheckTab';
import './AnalysisResults.css';

function AnalysisResults({ results }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tokens');

  if (!results) {
    return null;
  }

  const participlesCount = results.tokens?.filter(t => t.participle).length || 0;
  const adverbsCount = results.tokens?.filter(t => t.adverb_classification).length || 0;
  const verbsCount = results.tokens?.filter(t => t.pos === 'VERB').length || 0;
  const adjectivesCount = results.tokens?.filter(t => t.adjective_analysis).length || 0;
  const prepositionsCount = results.tokens?.filter(t => t.preposition_analysis).length || 0;
  const grammarConstructionsCount = results.grammar_constructions?.length || 0;
  const grammarErrorsCount = results.grammar_errors?.length || 0;

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
        {participlesCount > 0 && (
          <button
            className={activeTab === 'participles' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('participles')}
          >
            {t('participles')} ({participlesCount})
          </button>
        )}
        {adverbsCount > 0 && (
          <button
            className={activeTab === 'adverbs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('adverbs')}
          >
            {t('adverbs')} ({adverbsCount})
          </button>
        )}
        {verbsCount > 0 && (
          <button
            className={activeTab === 'verbs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('verbs')}
          >
            {t('verbs')} ({verbsCount})
          </button>
        )}
        {adjectivesCount > 0 && (
          <button
            className={activeTab === 'adjectives' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('adjectives')}
          >
            {t('adjectives')} ({adjectivesCount})
          </button>
        )}
        {prepositionsCount > 0 && (
          <button
            className={activeTab === 'prepositions' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('prepositions')}
          >
            {t('prepositions')} ({prepositionsCount})
          </button>
        )}
        {grammarConstructionsCount > 0 && (
          <button
            className={activeTab === 'grammarConstructions' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('grammarConstructions')}
          >
            {t('grammarConstructions')} ({grammarConstructionsCount})
          </button>
        )}
        {results.statistics && (
          <button
            className={activeTab === 'statistics' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('statistics')}
          >
            {t('statistics')}
          </button>
        )}
        {results.complexity_metrics && (
          <button
            className={activeTab === 'complexity' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('complexity')}
          >
            {t('complexityAnalysis')}
          </button>
        )}
        <button
          className={activeTab === 'grammarCheck' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('grammarCheck')}
        >
          {t('grammarCheck')}
          {grammarErrorsCount > 0 && (
            <span className="error-badge">{grammarErrorsCount}</span>
          )}
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
        {activeTab === 'participles' && <ParticiplesTab tokens={results.tokens} />}
        {activeTab === 'adverbs' && <AdverbsTab tokens={results.tokens} />}
        {activeTab === 'verbs' && <VerbsTab tokens={results.tokens} />}
        {activeTab === 'adjectives' && <AdjectivesTab tokens={results.tokens} />}
        {activeTab === 'prepositions' && (
          <PrepositionsTab 
            tokens={results.tokens}
            nestedPrepositionalPhrases={results.nested_prepositional_phrases}
          />
        )}
        {activeTab === 'grammarConstructions' && (
          <GrammarConstructionsTab 
            grammarConstructions={results.grammar_constructions}
            sentences={results.sentences}
          />
        )}
        {activeTab === 'statistics' && (
          <StatisticsTab 
            tokens={results.tokens} 
            statistics={results.statistics}
          />
        )}
        {activeTab === 'complexity' && (
          <ComplexityAnalysisTab 
            complexityMetrics={results.complexity_metrics}
          />
        )}
        {activeTab === 'grammarCheck' && (
          <GrammarCheckTab 
            tokens={results.tokens}
            grammarErrors={results.grammar_errors}
            sentences={results.sentences}
          />
        )}
      </div>
    </div>
  );
}

export default AnalysisResults;

