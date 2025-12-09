import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import * as d3 from 'd3';
import './DependencyTree.css';

function DependencyTree({ tree, tokens }) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'static'
  const [filteredPos, setFilteredPos] = useState([]); // Массив POS-тегов для фильтрации
  const [filteredDeps, setFilteredDeps] = useState([]); // Массив зависимостей для фильтрации
  const [showFilters, setShowFilters] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (viewMode === 'interactive' && tree && svgRef.current) {
      drawInteractiveTree();
    }
  }, [tree, viewMode, tokens, filteredPos, filteredDeps]);

  const drawInteractiveTree = () => {
    if (!tree || !tree.nodes || !tree.edges) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current?.clientWidth || 800;
    const height = 600;
    svg.attr('width', width).attr('height', height);

    // Фильтрация узлов и связей
    let filteredNodes = tree.nodes.map(n => ({ ...n }));
    let filteredLinks = tree.edges.map(e => ({ ...e }));

    // Фильтрация по POS-тегам
    if (filteredPos.length > 0) {
      const posSet = new Set(filteredPos);
      filteredNodes = filteredNodes.filter(n => posSet.has(n.pos));
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
      filteredLinks = filteredLinks.filter(l => 
        filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target)
      );
    }

    // Фильтрация по типам зависимостей
    if (filteredDeps.length > 0) {
      const depSet = new Set(filteredDeps);
      filteredLinks = filteredLinks.filter(l => depSet.has(l.relation));
      const linkedNodeIds = new Set();
      filteredLinks.forEach(l => {
        linkedNodeIds.add(l.source);
        linkedNodeIds.add(l.target);
      });
      filteredNodes = filteredNodes.filter(n => linkedNodeIds.has(n.id));
    }

    // Копирование данных для D3 (D3 мутирует данные)
    const nodes = filteredNodes.map(n => ({ ...n }));
    const links = filteredLinks.map(e => ({ ...e }));

    // Создание симуляции силы
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Создание линий для связей
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'dependency-link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Добавление меток на связи
    const linkLabels = svg.append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'dependency-label')
      .text(d => d.relation)
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle');

    // Создание узлов
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'dependency-node')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Круги для узлов
    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => getNodeColor(d.pos))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Текст в узлах
    node.append('text')
      .text(d => d.text)
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold');

    // Обновление позиций при симуляции
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const getNodeColor = (pos) => {
    const colors = {
      'NOUN': '#8e44ad',
      'VERB': '#e74c3c',
      'ADJ': '#3498db',
      'ADV': '#2ecc71',
      'PRON': '#f39c12',
      'DET': '#16a085',
      'ADP': '#9b59b6',
      'CONJ': '#e67e22',
      'NUM': '#1abc9c',
      'PUNCT': '#95a5a6'
    };
    return colors[pos] || '#7f8c8d';
  };

  const renderStaticTree = () => {
    if (!tree || !tree.nodes || !tokens) return null;

    // Фильтрация узлов и связей
    let filteredNodes = tree.nodes;
    let filteredEdges = tree.edges;

    if (filteredPos.length > 0) {
      const posSet = new Set(filteredPos);
      filteredNodes = filteredNodes.filter(n => posSet.has(n.pos));
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(e => 
        filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
      );
    }

    if (filteredDeps.length > 0) {
      const depSet = new Set(filteredDeps);
      filteredEdges = filteredEdges.filter(e => depSet.has(e.relation));
      const linkedNodeIds = new Set();
      filteredEdges.forEach(e => {
        linkedNodeIds.add(e.source);
        linkedNodeIds.add(e.target);
      });
      filteredNodes = filteredNodes.filter(n => linkedNodeIds.has(n.id));
    }

    // Построение дерева от корня
    const rootId = tree.root;
    const nodesMap = new Map(filteredNodes.map(n => [n.id, n]));
    const edgesMap = new Map();
    
    filteredEdges.forEach(edge => {
      if (!edgesMap.has(edge.target)) {
        edgesMap.set(edge.target, []);
      }
      edgesMap.get(edge.target).push(edge);
    });

    const renderNode = (nodeId, level = 0) => {
      const node = nodesMap.get(nodeId);
      if (!node) return null;

      const children = filteredEdges
        .filter(e => e.target === nodeId)
        .map(e => e.source);

      return (
        <div key={nodeId} className="static-tree-node" style={{ marginLeft: `${level * 30}px` }}>
          <div className="static-node-content">
            <span className="static-node-text">{node.text}</span>
            <span className="static-node-pos">{node.pos}</span>
            <span className="static-node-dep">{node.dep}</span>
          </div>
          {children.length > 0 && (
            <div className="static-tree-children">
              {children.map(childId => renderNode(childId, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="static-tree-container">
        <div className="static-tree-root">
          {renderNode(rootId)}
        </div>
      </div>
    );
  };

  if (!tree || !tree.nodes || tree.nodes.length === 0) {
    return <div className="dependency-tree-empty">{t('noTreeData')}</div>;
  }

  // Получаем уникальные POS-теги и зависимости
  const availablePos = tree ? [...new Set(tree.nodes.map(n => n.pos))].sort() : [];
  const availableDeps = tree ? [...new Set(tree.edges.map(e => e.relation))].sort() : [];

  const togglePosFilter = (pos) => {
    setFilteredPos(prev => 
      prev.includes(pos) 
        ? prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  };

  const toggleDepFilter = (dep) => {
    setFilteredDeps(prev => 
      prev.includes(dep) 
        ? prev.filter(d => d !== dep)
        : [...prev, dep]
    );
  };

  const clearFilters = () => {
    setFilteredPos([]);
    setFilteredDeps([]);
  };

  return (
    <div className="dependency-tree">
      <div className="tree-controls">
        <div className="view-controls">
          <button
            className={viewMode === 'interactive' ? 'control-btn active' : 'control-btn'}
            onClick={() => setViewMode('interactive')}
          >
            {t('interactiveView')}
          </button>
          <button
            className={viewMode === 'static' ? 'control-btn active' : 'control-btn'}
            onClick={() => setViewMode('static')}
          >
            {t('staticView')}
          </button>
        </div>
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {t('filters')} {showFilters ? '▼' : '▶'}
        </button>
      </div>

      {showFilters && (
        <div className="tree-filters">
          <div className="filter-section">
            <h4>{t('filterByPos')}</h4>
            <div className="filter-chips">
              {availablePos.map(pos => (
                <button
                  key={pos}
                  className={`filter-chip ${filteredPos.includes(pos) ? 'active' : ''}`}
                  onClick={() => togglePosFilter(pos)}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>{t('filterByDependency')}</h4>
            <div className="filter-chips">
              {availableDeps.map(dep => (
                <button
                  key={dep}
                  className={`filter-chip ${filteredDeps.includes(dep) ? 'active' : ''}`}
                  onClick={() => toggleDepFilter(dep)}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>
          {(filteredPos.length > 0 || filteredDeps.length > 0) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              {t('clearFilters')}
            </button>
          )}
        </div>
      )}

      <div className="tree-view-container" ref={containerRef}>
        {viewMode === 'interactive' ? (
          <svg ref={svgRef} className="dependency-tree-svg" />
        ) : (
          renderStaticTree()
        )}
      </div>

      <div className="tree-legend">
        <h4>{t('legend')}</h4>
        <div className="legend-items">
          {['NOUN', 'VERB', 'ADJ', 'ADV', 'PRON', 'DET', 'ADP', 'CONJ'].map(pos => (
            <div key={pos} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: getNodeColor(pos) }}
              />
              <span>{pos}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DependencyTree;

