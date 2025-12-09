"""
Анализ предлогов: классификация и предложные фразы
"""
from typing import Optional, Dict, Any, List
import spacy


# Классификация предлогов по значению
PREPOSITION_TYPES = {
    "time": ["at", "in", "on", "during", "for", "since", "until", "by", "before", "after", "within"],
    "place": ["at", "in", "on", "under", "over", "above", "below", "beside", "behind", "between", "among", "near", "far"],
    "direction": ["to", "from", "into", "onto", "toward", "towards", "through", "across", "along", "up", "down"],
    "agent": ["by", "with"],
    "instrument": ["with", "by"],
    "purpose": ["for", "to"],
    "possession": ["of", "with"],
    "manner": ["with", "by", "in"],
    "cause": ["because of", "due to", "owing to", "thanks to"],
    "concession": ["despite", "in spite of", "notwithstanding"],
    "exception": ["except", "except for", "but", "besides", "apart from"]
}

# Многословные предлоги
MULTIWORD_PREPOSITIONS = [
    "because of", "due to", "owing to", "thanks to",
    "in spite of", "instead of", "on behalf of",
    "in front of", "in back of", "on top of",
    "out of", "up to", "as well as"
]


def analyze_preposition(token, doc) -> Optional[Dict[str, Any]]:
    """
    Анализирует предлог: тип и предложную фразу
    """
    if token.pos_ != "ADP":
        return None
    
    preposition_info = {
        "type": _classify_preposition_type(token, doc),
        "prepositional_phrase": _analyze_prepositional_phrase(token, doc),
        "is_multiword": _is_multiword_preposition(token, doc)
    }
    
    return preposition_info


def _classify_preposition_type(token, doc) -> str:
    """
    Классифицирует тип предлога по значению
    """
    text = token.text.lower()
    lemma = token.lemma_.lower()
    
    # Проверяем многословные предлоги
    multiword = _get_multiword_preposition(token, doc)
    if multiword:
        text = multiword.lower()
    
    # Проверяем по словарю типов
    for prep_type, prepositions in PREPOSITION_TYPES.items():
        if text in prepositions or lemma in prepositions:
            return prep_type
    
    # Определяем по контексту
    return _classify_by_context(token, doc)


def _classify_by_context(token, doc) -> str:
    """
    Классифицирует предлог по контексту использования
    """
    # Находим объект предлога
    obj = None
    for child in token.children:
        if child.dep_ == "pobj":
            obj = child
            break
    
    if not obj:
        return "unknown"
    
    # Проверяем тип объекта
    if obj.pos_ in ["NOUN", "PRON"]:
        # Проверяем зависимость от глагола (время) или существительного (место)
        head = token.head
        if head.pos_ == "VERB":
            # Проверяем, есть ли временные маркеры
            if any(marker in [t.text.lower() for t in doc[token.i-3:token.i+3]] 
                   for marker in ["yesterday", "today", "tomorrow", "now", "then"]):
                return "time"
            return "place"
        elif head.pos_ == "NOUN":
            return "place"
    
    return "unknown"


def _analyze_prepositional_phrase(token, doc) -> Dict[str, Any]:
    """
    Анализирует предложную фразу
    """
    phrase = {
        "preposition": token.text,
        "object": None,
        "object_pos": None,
        "modifiers": [],
        "full_phrase": ""
    }
    
    # Находим объект предлога
    obj = None
    for child in token.children:
        if child.dep_ == "pobj":
            obj = child
            break
    
    if obj:
        phrase["object"] = obj.text
        phrase["object_pos"] = obj.pos_
        
        # Находим модификаторы объекта
        for child in obj.children:
            if child.dep_ in ["amod", "det", "nummod"]:
                phrase["modifiers"].append({
                    "text": child.text,
                    "pos": child.pos_,
                    "dep": child.dep_
                })
        
        # Формируем полную фразу
        phrase_start = token.i
        phrase_end = obj.i + 1
        phrase["full_phrase"] = doc[phrase_start:phrase_end].text
    
    return phrase


def _is_multiword_preposition(token, doc) -> bool:
    """
    Проверяет, является ли предлог многословным
    """
    return _get_multiword_preposition(token, doc) is not None


def _get_multiword_preposition(token, doc) -> Optional[str]:
    """
    Получает многословный предлог, если он есть
    """
    text = token.text.lower()
    
    # Проверяем следующие токены
    for i in range(token.i, min(token.i + 4, len(doc))):
        phrase = doc[token.i:i+1].text.lower()
        if phrase in MULTIWORD_PREPOSITIONS:
            return phrase
        
        # Проверяем комбинации
        if i > token.i:
            phrase = doc[token.i:i+1].text.lower()
            if phrase in MULTIWORD_PREPOSITIONS:
                return phrase
    
    return None


def find_nested_prepositional_phrases(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Находит вложенные предложные фразы
    """
    nested_phrases = []
    prepositions = [token for token in doc if token.pos_ == "ADP"]
    
    for prep in prepositions:
        # Находим объект предлога
        obj = None
        for child in prep.children:
            if child.dep_ == "pobj":
                obj = child
                break
        
        if not obj:
            continue
        
        # Проверяем, есть ли в объекте другие предлоги
        for child in obj.children:
            if child.pos_ == "ADP":
                # Найдена вложенная предложная фраза
                nested_phrases.append({
                    "outer_preposition": prep.text,
                    "outer_object": obj.text,
                    "inner_preposition": child.text,
                    "inner_object": None,
                    "sentence": prep.sent.text
                })
                
                # Находим объект внутреннего предлога
                for inner_child in child.children:
                    if inner_child.dep_ == "pobj":
                        nested_phrases[-1]["inner_object"] = inner_child.text
                        break
    
    return nested_phrases

