"""
Классификация наречий по семантике и морфологии
"""
from typing import Optional, Dict, Any, List
import spacy
import re


# Семантическая классификация наречий
SEMANTIC_ADVERBS = {
    "manner": ["quickly", "slowly", "carefully", "well", "badly", "easily", "hard", "fast", "loudly", "quietly"],
    "time": ["yesterday", "today", "tomorrow", "now", "then", "soon", "later", "earlier", "recently", "already", "yet", "still"],
    "place": ["here", "there", "above", "below", "upstairs", "downstairs", "nearby", "away", "everywhere", "nowhere", "somewhere"],
    "frequency": ["always", "never", "sometimes", "often", "usually", "rarely", "seldom", "frequently", "occasionally", "daily", "weekly"],
    "degree": ["very", "quite", "too", "enough", "rather", "pretty", "fairly", "extremely", "absolutely", "completely", "totally"],
    "sentence": ["unfortunately", "perhaps", "actually", "obviously", "certainly", "probably", "maybe", "indeed", "surely", "hopefully"]
}

# Морфологические паттерны
MORPHOLOGICAL_PATTERNS = {
    "simple": [],  # Будет определяться по отсутствию суффиксов
    "derived": ["-ly", "-ward", "-wise"],  # Суффиксы для производных наречий
    "compound": ["some", "any", "every", "no"],  # Начало сложных наречий
    "phrasal": ["from time to time", "once in a while", "now and then", "by and large"]
}


def classify_adverb(token, doc) -> Optional[Dict[str, Any]]:
    """
    Классифицирует наречие по семантике и морфологии
    """
    if token.pos_ != "ADV":
        return None
    
    classification = {
        "semantic": _classify_semantic(token),
        "morphological": _classify_morphological(token),
        "modifies": _find_modified_word(token, doc),
        "position": _get_position_in_sentence(token, doc)
    }
    
    return classification


def _classify_semantic(token) -> str:
    """
    Семантическая классификация наречия
    """
    lemma = token.lemma_.lower()
    text = token.text.lower()
    
    # Проверяем по словарю
    for category, words in SEMANTIC_ADVERBS.items():
        if lemma in words or text in words:
            return category
    
    # Эвристики для неопределенных случаев
    # Time: слова с временным значением
    if text in ["now", "then", "when", "while"]:
        return "time"
    
    # Place: слова с пространственным значением
    if text in ["here", "there", "where"]:
        return "place"
    
    # Degree: слова, усиливающие значение
    if text in ["very", "much", "quite", "too", "so"]:
        return "degree"
    
    # По умолчанию - manner
    return "manner"


def _classify_morphological(token) -> str:
    """
    Морфологическая классификация наречия
    """
    text = token.text.lower()
    lemma = token.lemma_.lower()
    
    # Проверка на фразовое наречие (несколько слов)
    # Это будет обрабатываться на уровне фраз
    
    # Проверка на сложное наречие
    for prefix in MORPHOLOGICAL_PATTERNS["compound"]:
        if text.startswith(prefix) and len(text) > len(prefix):
            return "compound"
    
    # Проверка на производное наречие (с суффиксом -ly)
    if text.endswith("ly") or lemma.endswith("ly"):
        return "derived"
    
    # Проверка на другие суффиксы
    if text.endswith("ward") or text.endswith("wise"):
        return "derived"
    
    # Простое наречие
    return "simple"


def _find_modified_word(token, doc) -> Optional[Dict[str, Any]]:
    """
    Находит слово, которое модифицирует наречие
    """
    # Наречие обычно модифицирует:
    # 1. Глагол (advmod)
    # 2. Прилагательное (advmod)
    # 3. Другое наречие (advmod)
    # 4. Все предложение (sentmod)
    
    head = token.head
    
    if head != token:
        return {
            "id": head.i,
            "text": head.text,
            "lemma": head.lemma_,
            "pos": head.pos_,
            "relation": token.dep_
        }
    
    return None


def _get_position_in_sentence(token, doc) -> str:
    """
    Определяет позицию наречия в предложении
    """
    # Находим предложение, в котором находится токен
    for sent in doc.sents:
        if sent.start <= token.i < sent.end:
            sent_length = sent.end - sent.start
            position = token.i - sent.start
            
            # Нормализуем позицию (0.0 - 1.0)
            normalized = position / sent_length if sent_length > 0 else 0
            
            if normalized < 0.2:
                return "beginning"
            elif normalized < 0.8:
                return "middle"
            else:
                return "end"
    
    return "unknown"

