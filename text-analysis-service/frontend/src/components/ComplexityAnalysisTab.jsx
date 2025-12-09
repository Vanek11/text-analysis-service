import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './ComplexityAnalysisTab.css';

function ComplexityAnalysisTab({ complexityMetrics }) {
  const { t } = useLanguage();

  if (!complexityMetrics) {
    return (
      <div className="complexity-tab">
        <div className="empty-state">
          <p>{t('noComplexityMetrics')}</p>
        </div>
      </div>
    );
  }

  const levelColors = {
    'A1': '#4caf50',
    'A2': '#8bc34a',
    'B1': '#ffc107',
    'B2': '#ff9800',
    'C1': '#ff5722',
    'C2': '#d32f2f'
  };

  const levelColor = levelColors[complexityMetrics.readability_level?.cefr_level] || '#666';

  // Данные для Radar Chart
  const radarData = [
    {
      metric: t('sentenceLength'),
      value: Math.min(complexityMetrics.average_sentence_length / 25 * 100, 100),
      fullMark: 100
    },
    {
      metric: t('dependencyDepth'),
      value: Math.min(complexityMetrics.average_dependency_depth / 10 * 100, 100),
      fullMark: 100
    },
    {
      metric: t('lexicalDiversity'),
      value: (complexityMetrics.lexical_diversity?.ttr || 0) * 100,
      fullMark: 100
    },
    {
      metric: t('complexityCoefficient'),
      value: Math.min(complexityMetrics.complexity_coefficient / 5 * 100, 100),
      fullMark: 100
    },
    {
      metric: t('readability'),
      value: complexityMetrics.flesch_kincaid?.score || 0,
      fullMark: 100
    }
  ];

  // Данные для Bar Chart
  const barData = [
    {
      name: t('sentences'),
      value: complexityMetrics.sentence_count
    },
    {
      name: t('words'),
      value: complexityMetrics.word_count
    },
    {
      name: t('syllables'),
      value: complexityMetrics.syllable_count
    },
    {
      name: t('characters'),
      value: complexityMetrics.character_count
    }
  ];

  return (
    <div className="complexity-tab">
      <div className="complexity-header">
        <h3>{t('complexityAnalysis')}</h3>
      </div>

      <div className="level-badge-container">
        <div className="level-badge" style={{ borderColor: levelColor, backgroundColor: `${levelColor}20` }}>
          <div className="level-label">{t('cefrLevel')}</div>
          <div className="level-value" style={{ color: levelColor }}>
            {complexityMetrics.readability_level?.cefr_level || 'N/A'}
          </div>
          <div className="level-description">
            {t(complexityMetrics.readability_level?.level_description || 'unknown')}
          </div>
          <div className="level-confidence">
            {t('confidence')}: {t(complexityMetrics.readability_level?.confidence || 'low')}
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h4>{t('averageSentenceLength')}</h4>
          <div className="metric-value">
            {complexityMetrics.average_sentence_length.toFixed(2)}
            <span className="metric-unit">{t('words')}</span>
          </div>
        </div>

        <div className="metric-card">
          <h4>{t('averageDependencyDepth')}</h4>
          <div className="metric-value">
            {complexityMetrics.average_dependency_depth.toFixed(2)}
            <span className="metric-unit">{t('levels')}</span>
          </div>
        </div>

        <div className="metric-card">
          <h4>{t('complexityCoefficient')}</h4>
          <div className="metric-value">
            {complexityMetrics.complexity_coefficient}
          </div>
        </div>

        <div className="metric-card">
          <h4>{t('lexicalDiversity')} (TTR)</h4>
          <div className="metric-value">
            {complexityMetrics.lexical_diversity?.ttr?.toFixed(3) || '0.000'}
          </div>
          <div className="metric-detail">
            {complexityMetrics.lexical_diversity?.unique_words || 0} {t('uniqueWords')} / {complexityMetrics.lexical_diversity?.total_words || 0} {t('totalWords')}
          </div>
        </div>

        <div className="metric-card">
          <h4>{t('fleschKincaidScore')}</h4>
          <div className="metric-value">
            {complexityMetrics.flesch_kincaid?.score?.toFixed(2) || '0.00'}
          </div>
          <div className="metric-detail">
            {t('gradeLevel')}: {complexityMetrics.flesch_kincaid?.grade_level?.toFixed(1) || '0.0'}
          </div>
          <div className="metric-detail">
            {t('readability')}: {t(complexityMetrics.flesch_kincaid?.readability || 'unknown')}
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h4>{t('complexityRadar')}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name={t('complexity')}
                dataKey="value"
                stroke={levelColor}
                fill={levelColor}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>{t('textStatistics')}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ComplexityAnalysisTab;

