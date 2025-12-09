import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StatisticsTab.css';

function StatisticsTab({ tokens, statistics }) {
  const { t } = useLanguage();

  const posChartData = useMemo(() => {
    if (!statistics?.pos_distribution) return [];
    return Object.entries(statistics.pos_distribution).map(([name, value]) => ({
      name: name,
      value: value
    })).sort((a, b) => b.value - a.value);
  }, [statistics]);

  const adverbSemanticData = useMemo(() => {
    if (!statistics?.adverbs?.by_semantic) return [];
    return Object.entries(statistics.adverbs.by_semantic).map(([name, value]) => ({
      name: t(name),
      value: value
    }));
  }, [statistics, t]);

  const COLORS = ['#4a90e2', '#50c878', '#ff6b6b', '#ffa500', '#9b59b6', '#1abc9c', '#e74c3c', '#3498db', '#f39c12', '#95a5a6'];

  const posHeatMapData = useMemo(() => {
    if (!statistics?.pos_distribution) return [];
    const sorted = Object.entries(statistics.pos_distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return sorted.map(([pos, count], index) => ({
      pos,
      count,
      intensity: Math.min(count / sorted[0][1], 1)
    }));
  }, [statistics]);

  if (!statistics) {
    return (
      <div className="statistics-tab">
        <div className="empty-state">
          <p>{t('noStatisticsAvailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-tab">
      <div className="statistics-header">
        <h3>{t('textStatistics')}</h3>
      </div>

      <div className="statistics-grid">
        {/* POS Distribution Pie Chart */}
        <div className="stat-card">
          <h4>{t('posDistribution')}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={posChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {posChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* POS Distribution Bar Chart */}
        <div className="stat-card">
          <h4>{t('posDistribution')} - {t('barChart')}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={posChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Adverb Semantic Distribution */}
        {adverbSemanticData.length > 0 && (
          <div className="stat-card">
            <h4>{t('adverbSemanticDistribution')}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={adverbSemanticData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adverbSemanticData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* POS Heat Map */}
        <div className="stat-card">
          <h4>{t('posHeatMap')}</h4>
          <div className="heat-map">
            {posHeatMapData.map((item, index) => (
              <div key={item.pos} className="heat-map-item">
                <div className="heat-map-label">{item.pos}</div>
                <div className="heat-map-bar-container">
                  <div 
                    className="heat-map-bar"
                    style={{
                      width: `${item.intensity * 100}%`,
                      backgroundColor: `rgba(74, 144, 226, ${0.3 + item.intensity * 0.7})`
                    }}
                  >
                    <span className="heat-map-value">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="stat-card stat-summary">
          <h4>{t('summaryStatistics')}</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">{t('totalTokens')}:</span>
              <span className="summary-value">{tokens?.length || 0}</span>
            </div>
            {statistics.participles && (
              <>
                <div className="summary-item">
                  <span className="summary-label">{t('totalParticiples')}:</span>
                  <span className="summary-value">{statistics.participles.total || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('presentParticiples')}:</span>
                  <span className="summary-value">{statistics.participles.present || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('pastParticiples')}:</span>
                  <span className="summary-value">{statistics.participles.past || 0}</span>
                </div>
              </>
            )}
            {statistics.verbs && (
              <>
                <div className="summary-item">
                  <span className="summary-label">{t('totalVerbs')}:</span>
                  <span className="summary-value">{statistics.verbs.total || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('modalVerbs')}:</span>
                  <span className="summary-value">{statistics.verbs.modal || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('phrasalVerbs')}:</span>
                  <span className="summary-value">{statistics.verbs.phrasal || 0}</span>
                </div>
              </>
            )}
            {statistics.adverbs && (
              <div className="summary-item">
                <span className="summary-label">{t('totalAdverbs')}:</span>
                <span className="summary-value">{statistics.adverbs.total || 0}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsTab;

