"""
Анализ синтаксической сложности текста
"""
from typing import Dict, Any, List
import spacy
import math


def calculate_complexity_metrics(doc, tokens: List[Dict[str, Any]], dependency_tree: Dict[str, Any]) -> Dict[str, Any]:
    """
    Вычисляет метрики синтаксической сложности
    """
    sentences = list(doc.sents)
    
    metrics = {
        "average_sentence_length": _calculate_average_sentence_length(sentences),
        "average_dependency_depth": _calculate_average_dependency_depth(dependency_tree, tokens),
        "complexity_coefficient": _calculate_complexity_coefficient(sentences, dependency_tree),
        "lexical_diversity": _calculate_lexical_diversity(tokens),
        "flesch_kincaid": _calculate_flesch_kincaid(doc, sentences),
        "readability_level": _determine_readability_level(doc, sentences, tokens),
        "sentence_count": len(sentences),
        "word_count": len([t for t in tokens if t.get("pos") not in ["PUNCT", "SYM"]]),
        "syllable_count": _estimate_syllable_count(doc),
        "character_count": len(doc.text)
    }
    
    return metrics


def _calculate_average_sentence_length(sentences) -> float:
    """
    Вычисляет среднюю длину предложения (в словах)
    """
    if not sentences:
        return 0.0
    
    total_words = sum(len([token for token in sent if token.pos_ not in ["PUNCT", "SYM"]]) for sent in sentences)
    return total_words / len(sentences)


def _calculate_average_dependency_depth(dependency_tree: Dict[str, Any], tokens: List[Dict[str, Any]]) -> float:
    """
    Вычисляет среднюю глубину дерева зависимостей
    """
    if not dependency_tree or not dependency_tree.get("nodes"):
        return 0.0
    
    depths = []
    root_id = dependency_tree.get("root")
    
    if root_id is None:
        return 0.0
    
    # Строим граф зависимостей
    children_map = {}
    for edge in dependency_tree.get("edges", []):
        parent = edge["target"]
        child = edge["source"]
        if parent not in children_map:
            children_map[parent] = []
        children_map[parent].append(child)
    
    # Вычисляем глубину для каждого узла
    def get_depth(node_id, visited=None):
        if visited is None:
            visited = set()
        if node_id in visited:
            return 0
        visited.add(node_id)
        
        if node_id == root_id:
            return 0
        
        # Находим родителя
        parent = None
        for edge in dependency_tree.get("edges", []):
            if edge["source"] == node_id:
                parent = edge["target"]
                break
        
        if parent is None:
            return 0
        
        return 1 + get_depth(parent, visited)
    
    # Вычисляем глубину для всех узлов
    for node in dependency_tree.get("nodes", []):
        depth = get_depth(node["id"])
        depths.append(depth)
    
    if not depths:
        return 0.0
    
    return sum(depths) / len(depths)


def _calculate_complexity_coefficient(sentences, dependency_tree: Dict[str, Any]) -> float:
    """
    Вычисляет коэффициент сложности на основе длины предложений и глубины зависимостей
    """
    avg_length = _calculate_average_sentence_length(sentences)
    
    # Упрощенный расчет глубины
    if dependency_tree and dependency_tree.get("edges"):
        max_depth = max(
            len([e for e in dependency_tree["edges"] if e["target"] == node["id"]])
            for node in dependency_tree.get("nodes", [])
        ) if dependency_tree.get("nodes") else 0
    else:
        max_depth = 0
    
    # Коэффициент сложности = средняя длина * максимальная глубина / 10
    complexity = (avg_length * max_depth) / 10.0 if max_depth > 0 else avg_length / 10.0
    
    return round(complexity, 2)


def _calculate_lexical_diversity(tokens: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Вычисляет лексическое разнообразие (TTR - Type-Token Ratio)
    """
    # Фильтруем только слова (исключаем пунктуацию)
    words = [t for t in tokens if t.get("pos") not in ["PUNCT", "SYM", "SPACE"]]
    
    if not words:
        return {"ttr": 0.0, "unique_words": 0, "total_words": 0}
    
    # Уникальные слова (леммы)
    unique_lemmas = set(t.get("lemma", "").lower() for t in words if t.get("lemma"))
    unique_words = len(unique_lemmas)
    total_words = len(words)
    
    # TTR = количество уникальных слов / общее количество слов
    ttr = unique_words / total_words if total_words > 0 else 0.0
    
    return {
        "ttr": round(ttr, 3),
        "unique_words": unique_words,
        "total_words": total_words,
        "vocabulary_richness": round((unique_words / total_words) * 100, 1) if total_words > 0 else 0.0
    }


def _estimate_syllable_count(doc) -> int:
    """
    Оценивает количество слогов в тексте
    """
    total_syllables = 0
    
    for token in doc:
        if token.pos_ in ["PUNCT", "SYM", "SPACE"]:
            continue
        
        word = token.text.lower()
        # Простая эвристика подсчета слогов
        syllables = _count_syllables(word)
        total_syllables += syllables
    
    return total_syllables


def _count_syllables(word: str) -> int:
    """
    Подсчитывает количество слогов в слове
    """
    word = word.lower().strip(".,!?;:")
    if not word:
        return 0
    
    # Удаляем немые e в конце
    if word.endswith("e"):
        word = word[:-1]
    
    # Подсчитываем гласные
    vowels = "aeiouy"
    syllable_count = 0
    prev_was_vowel = False
    
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_was_vowel:
            syllable_count += 1
        prev_was_vowel = is_vowel
    
    # Минимум 1 слог
    return max(1, syllable_count)


def _calculate_flesch_kincaid(doc, sentences) -> Dict[str, float]:
    """
    Вычисляет индекс читаемости Flesch-Kincaid
    """
    if not sentences:
        return {"score": 0.0, "grade_level": 0.0, "readability": "unknown"}
    
    total_sentences = len(sentences)
    total_words = len([token for token in doc if token.pos_ not in ["PUNCT", "SYM", "SPACE"]])
    total_syllables = _estimate_syllable_count(doc)
    
    if total_words == 0 or total_sentences == 0:
        return {"score": 0.0, "grade_level": 0.0, "readability": "unknown"}
    
    # Flesch Reading Ease Score
    # Score = 206.835 - (1.015 × ASL) - (84.6 × ASW)
    # ASL = средняя длина предложения (в словах)
    # ASW = среднее количество слогов на слово
    asl = total_words / total_sentences
    asw = total_syllables / total_words
    
    flesch_score = 206.835 - (1.015 * asl) - (84.6 * asw)
    flesch_score = max(0, min(100, flesch_score))  # Ограничиваем от 0 до 100
    
    # Flesch-Kincaid Grade Level
    # Grade = (0.39 × ASL) + (11.8 × ASW) - 15.59
    grade_level = (0.39 * asl) + (11.8 * asw) - 15.59
    grade_level = max(0, grade_level)
    
    return {
        "score": round(flesch_score, 2),
        "grade_level": round(grade_level, 2),
        "readability": _interpret_flesch_score(flesch_score)
    }


def _interpret_flesch_score(score: float) -> str:
    """
    Интерпретирует оценку Flesch
    """
    if score >= 90:
        return "very_easy"
    elif score >= 80:
        return "easy"
    elif score >= 70:
        return "fairly_easy"
    elif score >= 60:
        return "standard"
    elif score >= 50:
        return "fairly_difficult"
    elif score >= 30:
        return "difficult"
    else:
        return "very_difficult"


def _determine_readability_level(doc, sentences, tokens: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Определяет уровень сложности текста (A1-C2 по CEFR)
    """
    # Вычисляем различные метрики
    avg_sentence_length = _calculate_average_sentence_length(sentences)
    lexical_diversity = _calculate_lexical_diversity(tokens)
    flesch = _calculate_flesch_kincaid(doc, sentences)
    
    # Критерии для определения уровня
    ttr = lexical_diversity.get("ttr", 0)
    flesch_score = flesch.get("score", 0)
    
    # Определение уровня на основе метрик
    level = "B1"  # По умолчанию средний уровень
    
    if avg_sentence_length < 10 and ttr < 0.4 and flesch_score > 70:
        level = "A1"
    elif avg_sentence_length < 12 and ttr < 0.5 and flesch_score > 60:
        level = "A2"
    elif avg_sentence_length < 15 and ttr < 0.6 and flesch_score > 50:
        level = "B1"
    elif avg_sentence_length < 18 and ttr < 0.7 and flesch_score > 40:
        level = "B2"
    elif avg_sentence_length < 22 and ttr < 0.75 and flesch_score > 30:
        level = "C1"
    else:
        level = "C2"
    
    return {
        "cefr_level": level,
        "level_description": _get_level_description(level),
        "confidence": _calculate_confidence(avg_sentence_length, ttr, flesch_score, level)
    }


def _get_level_description(level: str) -> str:
    """
    Возвращает описание уровня CEFR
    """
    descriptions = {
        "A1": "Beginner - Basic user",
        "A2": "Elementary - Basic user",
        "B1": "Intermediate - Independent user",
        "B2": "Upper Intermediate - Independent user",
        "C1": "Advanced - Proficient user",
        "C2": "Proficiency - Proficient user"
    }
    return descriptions.get(level, "Unknown")


def _calculate_confidence(avg_length: float, ttr: float, flesch: float, level: str) -> str:
    """
    Вычисляет уверенность в определении уровня
    """
    # Простая эвристика: если метрики согласуются, уверенность высокая
    level_ranges = {
        "A1": {"length": (0, 10), "ttr": (0, 0.4), "flesch": (70, 100)},
        "A2": {"length": (8, 12), "ttr": (0.3, 0.5), "flesch": (60, 80)},
        "B1": {"length": (10, 15), "ttr": (0.4, 0.6), "flesch": (50, 70)},
        "B2": {"length": (13, 18), "ttr": (0.5, 0.7), "flesch": (40, 60)},
        "C1": {"length": (16, 22), "ttr": (0.6, 0.75), "flesch": (30, 50)},
        "C2": {"length": (20, 100), "ttr": (0.7, 1.0), "flesch": (0, 40)}
    }
    
    range_info = level_ranges.get(level, {})
    matches = 0
    
    if range_info.get("length"):
        min_len, max_len = range_info["length"]
        if min_len <= avg_length <= max_len:
            matches += 1
    
    if range_info.get("ttr"):
        min_ttr, max_ttr = range_info["ttr"]
        if min_ttr <= ttr <= max_ttr:
            matches += 1
    
    if range_info.get("flesch"):
        min_flesch, max_flesch = range_info["flesch"]
        if min_flesch <= flesch <= max_flesch:
            matches += 1
    
    if matches == 3:
        return "high"
    elif matches == 2:
        return "medium"
    else:
        return "low"

