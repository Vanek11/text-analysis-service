"""
Расширенный анализ глаголов: фразовые, модальные, вспомогательные
"""
from typing import Optional, Dict, Any, List
import spacy


# Модальные глаголы и их значения
MODAL_VERBS = {
    "can": {"ability": True, "permission": True, "possibility": True},
    "could": {"ability": True, "permission": True, "possibility": True, "past_ability": True},
    "may": {"permission": True, "possibility": True},
    "might": {"possibility": True, "uncertainty": True},
    "must": {"necessity": True, "obligation": True, "deduction": True},
    "shall": {"future": True, "obligation": True},
    "should": {"advice": True, "obligation": True, "expectation": True},
    "will": {"future": True, "willingness": True},
    "would": {"conditional": True, "past_habit": True, "polite_request": True}
}

# Вспомогательные глаголы
AUXILIARY_VERBS = ["be", "have", "do"]

# Распространенные фразовые глаголы (частицы)
PHRASAL_PARTICLES = ["up", "down", "in", "out", "on", "off", "away", "back", "over", "through", "along", "around"]


def analyze_verb_type(token, doc) -> Optional[Dict[str, Any]]:
    """
    Определяет тип глагола: обычный, модальный, вспомогательный, фразовый
    """
    if token.pos_ != "VERB":
        return None
    
    verb_info = {
        "type": "regular",
        "modal": None,
        "auxiliary": False,
        "phrasal": None
    }
    
    lemma = token.lemma_.lower()
    
    # Проверка на модальный глагол
    if lemma in MODAL_VERBS:
        verb_info["type"] = "modal"
        verb_info["modal"] = {
            "verb": lemma,
            "meanings": MODAL_VERBS[lemma]
        }
        return verb_info
    
    # Проверка на вспомогательный глагол
    if lemma in AUXILIARY_VERBS:
        verb_info["type"] = "auxiliary"
        verb_info["auxiliary"] = True
        verb_info["auxiliary_type"] = lemma
        return verb_info
    
    # Проверка на фразовый глагол
    phrasal = _detect_phrasal_verb(token, doc)
    if phrasal:
        verb_info["type"] = "phrasal"
        verb_info["phrasal"] = phrasal
        return verb_info
    
    return verb_info


def _detect_phrasal_verb(token, doc) -> Optional[Dict[str, Any]]:
    """
    Определяет фразовые глаголы
    """
    # Ищем частицы после глагола
    particles = []
    separable = False
    
    # Проверяем следующие токены
    for i in range(token.i + 1, min(token.i + 4, len(doc))):
        next_token = doc[i]
        # Если это частица и зависит от нашего глагола
        if next_token.text.lower() in PHRASAL_PARTICLES:
            if next_token.head == token or next_token.dep_ in ["prt", "advmod"]:
                particles.append(next_token.text.lower())
                # Проверяем, отделяемая ли частица (есть объект между глаголом и частицей)
                if i > token.i + 1:
                    # Есть слова между глаголом и частицей
                    for j in range(token.i + 1, i):
                        if doc[j].head == token and doc[j].dep_ in ["dobj", "pobj"]:
                            separable = True
                            break
    
    if particles:
        phrasal_verb = f"{token.lemma_} {particles[0]}"
        if len(particles) > 1:
            phrasal_verb += f" {particles[1]}"
        
        return {
            "base": token.lemma_,
            "particles": particles,
            "full_form": phrasal_verb,
            "separable": separable,
            "meaning": _get_phrasal_meaning(phrasal_verb)  # Можно расширить словарем
        }
    
    return None


def _get_phrasal_meaning(phrasal_verb: str) -> str:
    """
    Получает значение фразового глагола (можно расширить словарем)
    """
    # Базовый словарь распространенных фразовых глаголов
    meanings = {
        "put up": "tolerate, accommodate",
        "get along": "have a good relationship",
        "get along with": "have a good relationship with",
        "put off": "postpone",
        "give up": "stop trying, quit",
        "look after": "take care of",
        "turn on": "activate, switch on",
        "turn off": "deactivate, switch off",
        "come across": "find by chance",
        "break down": "stop working, analyze",
        "bring up": "raise, mention",
        "call off": "cancel",
        "find out": "discover",
        "give in": "surrender, yield",
        "look forward to": "anticipate with pleasure",
        "run out of": "use up, exhaust supply"
    }
    
    return meanings.get(phrasal_verb, "phrasal verb (meaning context-dependent)")

