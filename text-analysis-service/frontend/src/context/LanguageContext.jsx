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
    passive: 'passive',
    
    // New tabs
    participles: 'Participles',
    adverbs: 'Adverbs',
    verbs: 'Verbs',
    statistics: 'Statistics',
    grammarCheck: 'Grammar Check',
    
    // Participles
    noParticiplesFound: 'No participles found in the text',
    totalParticiples: 'Total Participles',
    presentParticiples: 'Present Participles',
    pastParticiples: 'Past Participles',
    filterByType: 'Filter by Type',
    filterByRole: 'Filter by Role',
    allTypes: 'All Types',
    allRoles: 'All Roles',
    progressiveTense: 'Progressive Tense',
    perfectTense: 'Perfect Tense',
    passiveVoice: 'Passive Voice',
    adjective: 'Adjective',
    gerund: 'Gerund',
    absoluteConstruction: 'Absolute Construction',
    roles: 'Roles',
    sentence: 'Sentence',
    search: 'Search',
    searchParticiples: 'Search participles...',
    noParticiplesMatch: 'No participles match the filters',
    
    // Adverbs
    noAdverbsFound: 'No adverbs found in the text',
    totalAdverbs: 'Total Adverbs',
    bySemantic: 'By Semantic',
    byMorphological: 'By Morphological',
    categories: 'categories',
    types: 'types',
    filterBySemantic: 'Filter by Semantic',
    filterByMorphological: 'Filter by Morphological',
    allSemantic: 'All Semantic',
    allMorphological: 'All Morphological',
    manner: 'Manner',
    time: 'Time',
    place: 'Place',
    frequency: 'Frequency',
    degree: 'Degree',
    semantic: 'Semantic',
    morphological: 'Morphological',
    position: 'Position',
    modifies: 'Modifies',
    sentenceLevel: 'Sentence Level',
    searchAdverbs: 'Search adverbs...',
    noAdverbsMatch: 'No adverbs match the filters',
    
    // Verbs
    noVerbsFound: 'No verbs found in the text',
    totalVerbs: 'Total Verbs',
    regular: 'Regular',
    modal: 'Modal',
    auxiliary: 'Auxiliary',
    phrasal: 'Phrasal',
    details: 'Details',
    modalVerb: 'Modal Verb',
    auxiliaryType: 'Auxiliary Type',
    phrasalVerb: 'Phrasal Verb',
    separable: 'Separable',
    meaning: 'Meaning',
    searchVerbs: 'Search verbs...',
    noVerbsMatch: 'No verbs match the filters',
    
    // Statistics
    noStatisticsAvailable: 'No statistics available',
    textStatistics: 'Text Statistics',
    posDistribution: 'POS Distribution',
    barChart: 'Bar Chart',
    adverbSemanticDistribution: 'Adverb Semantic Distribution',
    posHeatMap: 'POS Heat Map',
    summaryStatistics: 'Summary Statistics',
    totalTokens: 'Total Tokens',
    modalVerbs: 'Modal Verbs',
    phrasalVerbs: 'Phrasal Verbs',
    
    // Grammar Check
    noGrammarErrors: 'No grammar errors found!',
    errors: 'Errors',
    warnings: 'Warnings',
    total: 'Total',
    subjectVerbAgreement: 'Subject-Verb Agreement',
    articleUsage: 'Article Usage',
    tenseConsistency: 'Tense Consistency',
    token: 'Token',
    subject: 'Subject',
    suggestion: 'Suggestion',
    
    // Dependency Tree Filters
    filters: 'Filters',
    filterByPos: 'Filter by POS Tag',
    filterByDependency: 'Filter by Dependency Type',
    clearFilters: 'Clear All Filters',
    
    // Adverb Relations
    adverbRelations: 'Adverb Relations',
    noAdverbRelations: 'No adverb relations found'
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
    passive: 'страд.',
    
    // New tabs
    participles: 'Причастия',
    adverbs: 'Наречия',
    verbs: 'Глаголы',
    statistics: 'Статистика',
    grammarCheck: 'Проверка грамматики',
    
    // Participles
    noParticiplesFound: 'Причастия не найдены в тексте',
    totalParticiples: 'Всего причастий',
    presentParticiples: 'Причастия настоящего времени',
    pastParticiples: 'Причастия прошедшего времени',
    filterByType: 'Фильтр по типу',
    filterByRole: 'Фильтр по роли',
    allTypes: 'Все типы',
    allRoles: 'Все роли',
    progressiveTense: 'Продолженное время',
    perfectTense: 'Совершенное время',
    passiveVoice: 'Страдательный залог',
    adjective: 'Прилагательное',
    gerund: 'Герундий',
    absoluteConstruction: 'Абсолютная конструкция',
    roles: 'Роли',
    sentence: 'Предложение',
    search: 'Поиск',
    searchParticiples: 'Поиск причастий...',
    noParticiplesMatch: 'Нет причастий, соответствующих фильтрам',
    
    // Adverbs
    noAdverbsFound: 'Наречия не найдены в тексте',
    totalAdverbs: 'Всего наречий',
    bySemantic: 'По семантике',
    byMorphological: 'По морфологии',
    categories: 'категорий',
    types: 'типов',
    filterBySemantic: 'Фильтр по семантике',
    filterByMorphological: 'Фильтр по морфологии',
    allSemantic: 'Все семантические',
    allMorphological: 'Все морфологические',
    manner: 'Образ действия',
    time: 'Время',
    place: 'Место',
    frequency: 'Частота',
    degree: 'Степень',
    semantic: 'Семантика',
    morphological: 'Морфология',
    position: 'Позиция',
    modifies: 'Модифицирует',
    sentenceLevel: 'Уровень предложения',
    searchAdverbs: 'Поиск наречий...',
    noAdverbsMatch: 'Нет наречий, соответствующих фильтрам',
    
    // Verbs
    noVerbsFound: 'Глаголы не найдены в тексте',
    totalVerbs: 'Всего глаголов',
    regular: 'Обычные',
    modal: 'Модальные',
    auxiliary: 'Вспомогательные',
    phrasal: 'Фразовые',
    details: 'Детали',
    modalVerb: 'Модальный глагол',
    auxiliaryType: 'Тип вспомогательного',
    phrasalVerb: 'Фразовый глагол',
    separable: 'Разделяемый',
    meaning: 'Значение',
    searchVerbs: 'Поиск глаголов...',
    noVerbsMatch: 'Нет глаголов, соответствующих фильтрам',
    
    // Statistics
    noStatisticsAvailable: 'Статистика недоступна',
    textStatistics: 'Статистика текста',
    posDistribution: 'Распределение POS-тегов',
    barChart: 'Столбчатая диаграмма',
    adverbSemanticDistribution: 'Распределение наречий по семантике',
    posHeatMap: 'Тепловая карта POS-тегов',
    summaryStatistics: 'Сводная статистика',
    totalTokens: 'Всего токенов',
    modalVerbs: 'Модальные глаголы',
    phrasalVerbs: 'Фразовые глаголы',
    
    // Grammar Check
    noGrammarErrors: 'Грамматических ошибок не найдено!',
    errors: 'Ошибки',
    warnings: 'Предупреждения',
    total: 'Всего',
    subjectVerbAgreement: 'Согласование подлежащего и сказуемого',
    articleUsage: 'Использование артиклей',
    tenseConsistency: 'Согласованность времен',
    token: 'Токен',
    subject: 'Подлежащее',
    suggestion: 'Предложение',
    
    // Dependency Tree Filters
    filters: 'Фильтры',
    filterByPos: 'Фильтр по POS-тегу',
    filterByDependency: 'Фильтр по типу зависимости',
    clearFilters: 'Очистить все фильтры',
    
    // Adverb Relations
    adverbRelations: 'Связи наречий',
    noAdverbRelations: 'Связи наречий не найдены'
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

