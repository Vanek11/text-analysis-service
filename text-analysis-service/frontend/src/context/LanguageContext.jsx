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
    
    // Adjectives
    adjectives: 'Adjectives',
    noAdjectivesFound: 'No adjectives found in the text',
    totalAdjectives: 'Total Adjectives',
    filterByDegree: 'Filter by Degree',
    allDegrees: 'All Degrees',
    positive: 'Positive',
    comparative: 'Comparative',
    superlative: 'Superlative',
    baseForm: 'Base Form',
    formation: 'Formation',
    irregular: 'Irregular',
    descriptive: 'Descriptive',
    quantitative: 'Quantitative',
    demonstrative: 'Demonstrative',
    possessive: 'Possessive',
    interrogative: 'Interrogative',
    distributive: 'Distributive',
    indefinite: 'Indefinite',
    searchAdjectives: 'Search adjectives...',
    noAdjectivesMatch: 'No adjectives match the filters',
    
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
    posRadarChart: 'POS Radar Chart',
    frequency: 'Frequency',
    wordCloud: 'Word Cloud',
    sentenceTimeline: 'Sentence Timeline',
    nouns: 'Nouns',
    
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
    noAdverbRelations: 'No adverb relations found',
    
    // Grammar Constructions
    grammarConstructions: 'Grammar Constructions',
    noGrammarConstructionsFound: 'No grammar constructions found',
    totalConstructions: 'Total Constructions',
    tenses: 'Tenses',
    conditionals: 'Conditionals',
    reportedSpeech: 'Reported Speech',
    conditionalType: 'Conditional Type',
    type_1: 'Type 1 (Real Present/Future)',
    type_2: 'Type 2 (Unreal Present)',
    type_3: 'Type 3 (Unreal Past)',
    reportingVerb: 'Reporting Verb',
    searchConstructions: 'Search constructions...',
    
    // Prepositions
    prepositions: 'Prepositions',
    noPrepositionsFound: 'No prepositions found in the text',
    totalPrepositions: 'Total Prepositions',
    preposition: 'Preposition',
    prepositionalPhrase: 'Prepositional Phrase',
    nestedPhrases: 'Nested Phrases',
    nestedPrepositionalPhrases: 'Nested Prepositional Phrases',
    direction: 'Direction',
    agent: 'Agent',
    instrument: 'Instrument',
    purpose: 'Purpose',
    possession: 'Possession',
    cause: 'Cause',
    concession: 'Concession',
    exception: 'Exception',
    multiword: 'Multiword',
    yes: 'Yes',
    no: 'No',
    searchPrepositions: 'Search prepositions...',
    noPrepositionsMatch: 'No prepositions match the filters',
    
    // Complexity Analysis
    complexityAnalysis: 'Complexity Analysis',
    noComplexityMetrics: 'No complexity metrics available',
    cefrLevel: 'CEFR Level',
    confidence: 'Confidence',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    averageSentenceLength: 'Average Sentence Length',
    averageDependencyDepth: 'Average Dependency Depth',
    complexityCoefficient: 'Complexity Coefficient',
    lexicalDiversity: 'Lexical Diversity',
    fleschKincaidScore: 'Flesch-Kincaid Score',
    gradeLevel: 'Grade Level',
    sentenceLength: 'Sentence Length',
    dependencyDepth: 'Dependency Depth',
    readability: 'Readability',
    complexity: 'Complexity',
    complexityRadar: 'Complexity Radar Chart',
    words: 'words',
    levels: 'levels',
    uniqueWords: 'unique words',
    totalWords: 'total words',
    sentences: 'Sentences',
    syllables: 'Syllables',
    characters: 'Characters',
    very_easy: 'Very Easy',
    easy: 'Easy',
    fairly_easy: 'Fairly Easy',
    standard: 'Standard',
    fairly_difficult: 'Fairly Difficult',
    difficult: 'Difficult',
    very_difficult: 'Very Difficult',
    'Beginner - Basic user': 'Beginner - Basic user',
    'Elementary - Basic user': 'Elementary - Basic user',
    'Intermediate - Independent user': 'Intermediate - Independent user',
    'Upper Intermediate - Independent user': 'Upper Intermediate - Independent user',
    'Advanced - Proficient user': 'Advanced - Proficient user',
    'Proficiency - Proficient user': 'Proficiency - Proficient user',
    unknown: 'Unknown'
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
    
    // Adjectives
    adjectives: 'Прилагательные',
    noAdjectivesFound: 'Прилагательные не найдены в тексте',
    totalAdjectives: 'Всего прилагательных',
    filterByDegree: 'Фильтр по степени',
    allDegrees: 'Все степени',
    positive: 'Положительная',
    comparative: 'Сравнительная',
    superlative: 'Превосходная',
    baseForm: 'Базовая форма',
    formation: 'Образование',
    irregular: 'Неправильная',
    descriptive: 'Описательное',
    quantitative: 'Количественное',
    demonstrative: 'Указательное',
    possessive: 'Притяжательное',
    interrogative: 'Вопросительное',
    distributive: 'Распределительное',
    indefinite: 'Неопределенное',
    searchAdjectives: 'Поиск прилагательных...',
    noAdjectivesMatch: 'Нет прилагательных, соответствующих фильтрам',
    
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
    posRadarChart: 'Радарная диаграмма POS',
    frequency: 'Частота',
    wordCloud: 'Облако слов',
    sentenceTimeline: 'Хронология предложений',
    nouns: 'Существительные',
    
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
    noAdverbRelations: 'Связи наречий не найдены',
    
    // Grammar Constructions
    grammarConstructions: 'Грамматические конструкции',
    noGrammarConstructionsFound: 'Грамматические конструкции не найдены',
    totalConstructions: 'Всего конструкций',
    tenses: 'Времена',
    conditionals: 'Условные предложения',
    reportedSpeech: 'Косвенная речь',
    conditionalType: 'Тип условного предложения',
    type_1: 'Тип 1 (Реальное настоящее/будущее)',
    type_2: 'Тип 2 (Нереальное настоящее)',
    type_3: 'Тип 3 (Нереальное прошлое)',
    reportingVerb: 'Глагол сообщения',
    searchConstructions: 'Поиск конструкций...',
    
    // Prepositions
    prepositions: 'Предлоги',
    noPrepositionsFound: 'Предлоги не найдены в тексте',
    totalPrepositions: 'Всего предлогов',
    preposition: 'Предлог',
    prepositionalPhrase: 'Предложная фраза',
    nestedPhrases: 'Вложенные фразы',
    nestedPrepositionalPhrases: 'Вложенные предложные фразы',
    direction: 'Направление',
    agent: 'Агент',
    instrument: 'Инструмент',
    purpose: 'Цель',
    possession: 'Принадлежность',
    cause: 'Причина',
    concession: 'Уступка',
    exception: 'Исключение',
    multiword: 'Многословный',
    yes: 'Да',
    no: 'Нет',
    searchPrepositions: 'Поиск предлогов...',
    noPrepositionsMatch: 'Нет предлогов, соответствующих фильтрам',
    
    // Complexity Analysis
    complexityAnalysis: 'Анализ сложности',
    noComplexityMetrics: 'Метрики сложности недоступны',
    cefrLevel: 'Уровень CEFR',
    confidence: 'Уверенность',
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая',
    averageSentenceLength: 'Средняя длина предложения',
    averageDependencyDepth: 'Средняя глубина зависимостей',
    complexityCoefficient: 'Коэффициент сложности',
    lexicalDiversity: 'Лексическое разнообразие',
    fleschKincaidScore: 'Индекс Flesch-Kincaid',
    gradeLevel: 'Уровень класса',
    sentenceLength: 'Длина предложения',
    dependencyDepth: 'Глубина зависимостей',
    readability: 'Читаемость',
    complexity: 'Сложность',
    complexityRadar: 'Радарная диаграмма сложности',
    words: 'слов',
    levels: 'уровней',
    uniqueWords: 'уникальных слов',
    totalWords: 'всего слов',
    sentences: 'Предложения',
    syllables: 'Слоги',
    characters: 'Символы',
    very_easy: 'Очень легко',
    easy: 'Легко',
    fairly_easy: 'Довольно легко',
    standard: 'Стандартно',
    fairly_difficult: 'Довольно сложно',
    difficult: 'Сложно',
    very_difficult: 'Очень сложно',
    'Beginner - Basic user': 'Начальный - Базовый пользователь',
    'Elementary - Basic user': 'Элементарный - Базовый пользователь',
    'Intermediate - Independent user': 'Средний - Независимый пользователь',
    'Upper Intermediate - Independent user': 'Выше среднего - Независимый пользователь',
    'Advanced - Proficient user': 'Продвинутый - Компетентный пользователь',
    'Proficiency - Proficient user': 'Владение - Компетентный пользователь',
    unknown: 'Неизвестно'
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

