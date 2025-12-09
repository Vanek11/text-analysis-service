import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import WordCloud from 'react-wordcloud';
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

  // Word Cloud data
  const wordCloudData = useMemo(() => {
    if (!tokens) return [];
    const wordFreq = {};
    tokens.forEach(token => {
      if (token.pos && !['PUNCT', 'SYM', 'SPACE'].includes(token.pos)) {
        const word = token.text.toLowerCase();
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([text, value]) => ({ text, value }));
  }, [tokens]);

  // Timeline data (распределение по предложениям)
  const timelineData = useMemo(() => {
    if (!tokens || !statistics?.pos_distribution) return [];
    // Группируем токены по предложениям (упрощенно - по позициям)
    const sentences = [];
    let currentSentence = [];
    let sentenceIndex = 0;
    
    tokens.forEach((token, idx) => {
      if (token.pos === 'PUNCT' && ['.', '!', '?'].includes(token.text)) {
        if (currentSentence.length > 0) {
          sentences.push({
            sentence: sentenceIndex + 1,
            wordCount: currentSentence.length,
            verbCount: currentSentence.filter(t => t.pos === 'VERB').length,
            nounCount: currentSentence.filter(t => t.pos === 'NOUN').length
          });
          sentenceIndex++;
          currentSentence = [];
        }
      } else if (token.pos !== 'PUNCT' && token.pos !== 'SYM') {
        currentSentence.push(token);
      }
    });
    
    if (currentSentence.length > 0) {
      sentences.push({
        sentence: sentenceIndex + 1,
        wordCount: currentSentence.length,
        verbCount: currentSentence.filter(t => t.pos === 'VERB').length,
        nounCount: currentSentence.filter(t => t.pos === 'NOUN').length
      });
    }
    
    return sentences.slice(0, 20); // Ограничиваем 20 предложениями
  }, [tokens, statistics]);

  // Radar Chart data для POS распределения
  const radarData = useMemo(() => {
    if (!statistics?.pos_distribution) return [];
    return Object.entries(statistics.pos_distribution)
      .slice(0, 8)
      .map(([name, value]) => ({
        metric: name,
        value: value,
        fullMark: Math.max(...Object.values(statistics.pos_distribution))
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

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="stat-card">
            <h4>{t('posRadarChart')}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar
                  name={t('frequency')}
                  dataKey="value"
                  stroke="#4a90e2"
                  fill="#4a90e2"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Word Cloud */}
        {wordCloudData.length > 0 && (
          <div className="stat-card word-cloud-card">
            <h4>{t('wordCloud')}</h4>
            <div className="word-cloud-container">
              <WordCloud
                words={wordCloudData}
                options={{
                  rotations: 2,
                  rotationSteps: 2,
                  fontSizes: [12, 60],
                  fontFamily: 'Arial, sans-serif',
                  colors: ['#4a90e2', '#50c878', '#ff6b6b', '#ffa500', '#9b59b6']
                }}
                size={[600, 300]}
              />
            </div>
          </div>
        )}

        {/* Timeline */}
        {timelineData.length > 0 && (
          <div className="stat-card timeline-card">
            <h4>{t('sentenceTimeline')}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sentence" label={{ value: t('sentence'), position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wordCount" fill="#4a90e2" name={t('words')} />
                <Bar dataKey="verbCount" fill="#e74c3c" name={t('verbs')} />
                <Bar dataKey="nounCount" fill="#2ecc71" name={t('nouns')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

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

