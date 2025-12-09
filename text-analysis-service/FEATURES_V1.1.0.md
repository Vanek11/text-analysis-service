# Новые функции версии 1.1.0

## Реализовано (базовая структура)

### 1. Анализ причастий ✅

**Файлы:**
- `nlp-service/app/utils/participle_analyzer.py`

**Функциональность:**
- Определение Present Participles (-ing формы)
- Определение Past Participles
- Анализ ролей причастий:
  - Progressive времена (is running)
  - Perfect времена (has written)
  - Пассивный залог (was written)
  - Прилагательные (a running horse, a broken window)
  - Абсолютные конструкции
  - Герундий

**Использование:**
Причастия автоматически определяются для всех токенов с тегами VBG и VBN.

### 2. Расширенный анализ глаголов ✅

**Файлы:**
- `nlp-service/app/utils/verb_analyzer.py`

**Функциональность:**
- Определение модальных глаголов (can, could, may, might, must, etc.)
- Определение вспомогательных глаголов (be, have, do)
- Определение фразовых глаголов (put up, get along with, etc.)
- Классификация типов глаголов:
  - Regular (обычные)
  - Modal (модальные)
  - Auxiliary (вспомогательные)
  - Phrasal (фразовые)

**Особенности:**
- Определение отделяемых/неотделяемых частиц в фразовых глаголах
- Словарь значений распространенных фразовых глаголов

### 3. Классификация наречий ✅

**Файлы:**
- `nlp-service/app/utils/adverb_classifier.py`

**Функциональность:**

**Семантическая классификация:**
- Manner (образ действия): quickly, slowly, carefully
- Time (время): yesterday, now, then
- Place (место): here, there, above
- Frequency (частотность): always, never, often
- Degree (степень): very, quite, too
- Sentence (адвербиалы предложения): unfortunately, perhaps

**Морфологическая классификация:**
- Simple (простые): fast, hard, well
- Derived (производные): quickly, helpfully (с суффиксом -ly)
- Compound (сложные): somewhere, somehow
- Phrasal (фразовые): from time to time

**Дополнительно:**
- Определение модифицируемого слова
- Позиция в предложении (начало, середина, конец)

### 4. Расширенная статистика ✅

**Функциональность:**
- Распределение частей речи
- Статистика по причастиям (present/past)
- Статистика по типам глаголов (modal, phrasal)
- Статистика по типам наречий (семантическая классификация)

## Структура данных

### Новые поля в Token:

```json
{
  "verb_type": {
    "type": "phrasal",
    "phrasal": {
      "base": "put",
      "particles": ["up"],
      "full_form": "put up",
      "separable": false,
      "meaning": "tolerate, accommodate"
    }
  },
  "participle": {
    "type": "present",
    "form": "running",
    "base": "run",
    "roles": ["progressive_tense"]
  },
  "adverb_classification": {
    "semantic": "manner",
    "morphological": "derived",
    "modifies": {
      "id": 2,
      "text": "ran",
      "lemma": "run",
      "pos": "VERB"
    },
    "position": "middle"
  }
}
```

### Новое поле statistics в ответе:

```json
{
  "statistics": {
    "pos_distribution": {
      "NOUN": 5,
      "VERB": 3,
      "ADV": 2
    },
    "participles": {
      "total": 2,
      "present": 1,
      "past": 1
    },
    "verbs": {
      "total": 3,
      "modal": 1,
      "phrasal": 0
    },
    "adverbs": {
      "total": 2,
      "by_semantic": {
        "manner": 1,
        "time": 1
      }
    }
  }
}
```

## Следующие шаги

### Для полной реализации версии 1.1.0 необходимо:

1. **Frontend компоненты:**
   - Вкладка "Причастия" с таблицей и фильтрами
   - Вкладка "Наречия" с классификацией
   - Расширенная вкладка "Глаголы" с типами
   - Визуализация статистики (Pie Chart, Heat Map)

2. **Проверка грамматики:**
   - Subject-Verb Agreement
   - Article Usage
   - Verb Tense Consistency
   - Вкладка "Проверка грамматики"

3. **Улучшения визуализации:**
   - Pie Chart для распределения POS-тегов
   - Heat Map распределения частей речи
   - Улучшенное дерево зависимостей с фильтрацией

## Тестирование

Для тестирования новых функций используйте примеры:

**Причастия:**
- "The running horse is fast." (present participle как прилагательное)
- "I have finished my work." (past participle в perfect)
- "The book was written by the author." (past participle в пассиве)

**Фразовые глаголы:**
- "I can't put up with this noise." (put up with)
- "We need to get along with our neighbors." (get along with)

**Наречия:**
- "He ran quickly." (manner, derived)
- "I will go there tomorrow." (place, time)
- "She always arrives on time." (frequency)

## Примечания

- Все новые функции обратно совместимы с версией 1.0.0
- Новые поля опциональны и не нарушают существующий API
- Статистика добавляется автоматически при анализе

---

**Статус:** Базовая структура реализована, требуется доработка frontend компонентов

