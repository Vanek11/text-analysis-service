"""
Анализ прилагательных: классификация и степени сравнения
"""
from typing import Optional, Dict, Any
import spacy
import re


# Типы прилагательных
ADJECTIVE_TYPES = {
    "descriptive": ["big", "small", "beautiful", "ugly", "happy", "sad", "red", "blue"],
    "quantitative": ["many", "few", "several", "some", "all", "every", "each", "most"],
    "demonstrative": ["this", "that", "these", "those"],
    "possessive": ["my", "your", "his", "her", "its", "our", "their"],
    "interrogative": ["which", "what", "whose"],
    "distributive": ["each", "every", "either", "neither"],
    "indefinite": ["some", "any", "no", "all", "both", "few", "many", "several"]
}

# Паттерны для степеней сравнения
COMPARATIVE_SUFFIXES = ["-er", "ier", "ier"]
SUPERLATIVE_SUFFIXES = ["-est", "iest", "iest"]

# Исключения для степеней сравнения
IRREGULAR_COMPARATIVES = {
    "good": "better",
    "bad": "worse",
    "far": "farther",
    "little": "less",
    "much": "more",
    "many": "more",
    "old": "older",  # или elder
    "late": "later"
}

IRREGULAR_SUPERLATIVES = {
    "good": "best",
    "bad": "worst",
    "far": "farthest",
    "little": "least",
    "much": "most",
    "many": "most",
    "old": "oldest",  # или eldest
    "late": "latest"
}


def analyze_adjective(token, doc) -> Optional[Dict[str, Any]]:
    """
    Анализирует прилагательное: тип и степень сравнения
    """
    if token.pos_ != "ADJ":
        return None
    
    adjective_info = {
        "type": _classify_adjective_type(token),
        "degree": _analyze_degree(token),
        "formation_rules": _get_formation_rules(token)
    }
    
    return adjective_info


def _classify_adjective_type(token) -> str:
    """
    Классифицирует тип прилагательного
    """
    lemma = token.lemma_.lower()
    text = token.text.lower()
    tag = token.tag_
    
    # Demonstrative (это, то)
    if tag in ["DT"] and text in ["this", "that", "these", "those"]:
        return "demonstrative"
    
    # Possessive (мой, твой)
    if tag in ["PRP$", "POS"] or lemma in ["my", "your", "his", "her", "its", "our", "their"]:
        return "possessive"
    
    # Interrogative (какой, чей)
    if text in ["which", "what", "whose"]:
        return "interrogative"
    
    # Quantitative (много, мало)
    if lemma in ADJECTIVE_TYPES.get("quantitative", []):
        return "quantitative"
    
    # Distributive (каждый, всякий)
    if lemma in ADJECTIVE_TYPES.get("distributive", []):
        return "distributive"
    
    # Indefinite (некоторый, любой)
    if lemma in ADJECTIVE_TYPES.get("indefinite", []):
        return "indefinite"
    
    # Descriptive (описательные) - по умолчанию
    return "descriptive"


def _analyze_degree(token) -> Dict[str, Any]:
    """
    Анализирует степень сравнения прилагательного
    """
    text = token.text.lower()
    lemma = token.lemma_.lower()
    tag = token.tag_
    
    degree_info = {
        "degree": "positive",
        "base_form": lemma,
        "is_irregular": False
    }
    
    # Проверка на сравнительную степень
    if tag in ["JJR", "RBR"]:
        degree_info["degree"] = "comparative"
        # Проверка на неправильные формы
        if text in IRREGULAR_COMPARATIVES.values() or lemma in IRREGULAR_COMPARATIVES:
            degree_info["is_irregular"] = True
            degree_info["base_form"] = _find_base_from_comparative(text)
        else:
            # Удаляем суффикс -er
            if text.endswith("er"):
                degree_info["base_form"] = text[:-2]
            elif text.endswith("ier"):
                degree_info["base_form"] = text[:-3] + "y"
    
    # Проверка на превосходную степень
    elif tag in ["JJS", "RBS"]:
        degree_info["degree"] = "superlative"
        # Проверка на неправильные формы
        if text in IRREGULAR_SUPERLATIVES.values() or lemma in IRREGULAR_SUPERLATIVES:
            degree_info["is_irregular"] = True
            degree_info["base_form"] = _find_base_from_superlative(text)
        else:
            # Удаляем суффикс -est
            if text.endswith("est"):
                degree_info["base_form"] = text[:-3]
            elif text.endswith("iest"):
                degree_info["base_form"] = text[:-4] + "y"
    
    return degree_info


def _find_base_from_comparative(comparative: str) -> str:
    """
    Находит базовую форму от сравнительной степени
    """
    for base, comp in IRREGULAR_COMPARATIVES.items():
        if comp == comparative:
            return base
    return comparative


def _find_base_from_superlative(superlative: str) -> str:
    """
    Находит базовую форму от превосходной степени
    """
    for base, sup in IRREGULAR_SUPERLATIVES.items():
        if sup == superlative:
            return base
    return superlative


def _get_formation_rules(token) -> Dict[str, Any]:
    """
    Определяет правила образования степеней сравнения
    """
    text = token.text.lower()
    lemma = token.lemma_.lower()
    
    rules = {
        "formation_type": "regular",
        "rules": []
    }
    
    # Проверка на неправильные формы
    if lemma in IRREGULAR_COMPARATIVES or lemma in IRREGULAR_SUPERLATIVES:
        rules["formation_type"] = "irregular"
        rules["rules"].append("Uses irregular comparative/superlative forms")
        return rules
    
    # Правила для регулярных форм
    if len(lemma) <= 3:
        rules["rules"].append("Short adjective: add -er/-est")
    elif lemma.endswith("y"):
        rules["rules"].append("Ends in -y: change to -ier/-iest")
    elif lemma.endswith("e"):
        rules["rules"].append("Ends in -e: add -r/-st")
    elif _is_consonant_doubling(lemma):
        rules["rules"].append("Consonant doubling: double final consonant before -er/-est")
    elif len(lemma) >= 3 and _has_multiple_syllables(lemma):
        rules["rules"].append("Multi-syllable: use more/most")
    else:
        rules["rules"].append("Regular: add -er/-est")
    
    return rules


def _is_consonant_doubling(word: str) -> bool:
    """
    Проверяет, нужно ли удваивать согласную
    """
    if len(word) < 3:
        return False
    
    # Правило: согласная-гласная-согласная в конце
    vowels = "aeiou"
    if word[-1] not in vowels and word[-2] in vowels and word[-3] not in vowels:
        return True
    return False


def _has_multiple_syllables(word: str) -> bool:
    """
    Простая проверка на многосложность (по количеству гласных)
    """
    vowels = "aeiou"
    vowel_count = sum(1 for char in word if char in vowels)
    return vowel_count >= 2

