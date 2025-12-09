import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Переводы
const translations = {
  en: {
    // Header
    title: 'English Text Analysis Service',
    subtitle: 'Analyze English text with POS tagging, dependency parsing, and grammar analysis',
    
    // Text Input
    enterText: 'Enter English text to analyze:',
    placeholder: 'Enter your English text here...',
    characters: 'characters',
    includeMorphology: 'Include morphology',
    includeEntities: 'Include named entities',
    clear: 'Clear',
    analyzing: 'Analyzing...',
    analyzeText: 'Analyze Text',
    textTooLong: 'Text exceeds maximum length. Please use the async endpoint for longer texts.',
    
    // Analysis Results
    analysisResults: 'Analysis Results',
    tokens: 'Tokens',
    dependencyTree: 'Dependency Tree',
    grammarSummary: 'Grammar Summary',
    
    // Token Table
    searchTokens: 'Search tokens...',
    allPosTags: 'All POS tags',
    showing: 'Showing',
    of: 'of',
    tokensCount: 'tokens',
    id: 'ID',
    text: 'Text',
    lemma: 'Lemma',
    pos: 'POS',
    tag: 'Tag',
    dependency: 'Dependency',
    head: 'Head',
    grammar: 'Grammar',
    noTokens: 'No tokens to display',
    
    // Grammar Summary
    verbGrammarAnalysis: 'Verb Grammar Analysis',
    foundVerbs: 'Found',
    verb: 'verb',
    verbs: 'verbs',
    withGrammarInfo: 'with grammar information',
    tenseDistribution: 'Tense Distribution',
    aspectDistribution: 'Aspect Distribution',
    voiceDistribution: 'Voice Distribution',
    verbDetails: 'Verb Details',
    posTagDistribution: 'POS Tag Distribution',
    noGrammarData: 'No grammar data available',
    
    // Dependency Tree
    interactiveView: 'Interactive View',
    staticView: 'Static View',
    legend: 'Legend',
    noTreeData: 'No dependency tree data available',
    
    // Errors
    error: 'Error',
    errorOccurred: 'An error occurred during analysis',
    
    // Grammar labels
    tense: 'T',
    aspect: 'A',
    voice: 'V',
    past: 'past',
    present: 'present',
    future: 'future',
    simple: 'simple',
    progressive: 'progressive',
    perfect: 'perfect',
    active: 'active',
    passive: 'passive'
  },
  ru: {
    // Header
    title: 'Сервис анализа английского текста',
    subtitle: 'Анализ английского текста с POS-тегированием, синтаксическим разбором и грамматическим анализом',
    
    // Text Input
    enterText: 'Введите английский текст для анализа:',
    placeholder: 'Введите ваш английский текст здесь...',
    characters: 'символов',
    includeMorphology: 'Включить морфологию',
    includeEntities: 'Включить именованные сущности',
    clear: 'Очистить',
    analyzing: 'Анализ...',
    analyzeText: 'Анализировать текст',
    textTooLong: 'Текст превышает максимальную длину. Используйте асинхронный эндпоинт для длинных текстов.',
    
    // Analysis Results
    analysisResults: 'Результаты анализа',
    tokens: 'Токены',
    dependencyTree: 'Дерево зависимостей',
    grammarSummary: 'Грамматическая сводка',
    
    // Token Table
    searchTokens: 'Поиск токенов...',
    allPosTags: 'Все POS-теги',
    showing: 'Показано',
    of: 'из',
    tokensCount: 'токенов',
    id: 'ID',
    text: 'Текст',
    lemma: 'Лемма',
    pos: 'POS',
    tag: 'Тег',
    dependency: 'Зависимость',
    head: 'Голова',
    grammar: 'Грамматика',
    noTokens: 'Нет токенов для отображения',
    
    // Grammar Summary
    verbGrammarAnalysis: 'Анализ грамматики глаголов',
    foundVerbs: 'Найдено',
    verb: 'глагол',
    verbs: 'глаголов',
    withGrammarInfo: 'с грамматической информацией',
    tenseDistribution: 'Распределение по временам',
    aspectDistribution: 'Распределение по видам',
    voiceDistribution: 'Распределение по залогам',
    verbDetails: 'Детали глаголов',
    posTagDistribution: 'Распределение POS-тегов',
    noGrammarData: 'Нет данных о грамматике',
    
    // Dependency Tree
    interactiveView: 'Интерактивный вид',
    staticView: 'Статический вид',
    legend: 'Легенда',
    noTreeData: 'Нет данных о дереве зависимостей',
    
    // Errors
    error: 'Ошибка',
    errorOccurred: 'Произошла ошибка при анализе',
    
    // Grammar labels
    tense: 'В',
    aspect: 'Вид',
    voice: 'З',
    past: 'прош.',
    present: 'наст.',
    future: 'буд.',
    simple: 'простой',
    progressive: 'продолж.',
    perfect: 'соверш.',
    active: 'действ.',
    passive: 'страд.'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Загружаем сохраненный язык из localStorage или используем английский по умолчанию
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

