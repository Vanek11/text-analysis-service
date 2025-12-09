"""
Анализ причастий: Present и Past Participles
"""
from typing import Optional, Dict, Any
import spacy


def analyze_participle(token, doc) -> Optional[Dict[str, Any]]:
    """
    Анализирует причастия и их роли в предложении
    """
    # Present Participle (VBG - ending in -ing)
    if token.tag_ == "VBG":
        return _analyze_present_participle(token, doc)
    
    # Past Participle (VBN)
    if token.tag_ == "VBN":
        return _analyze_past_participle(token, doc)
    
    return None


def _analyze_present_participle(token, doc) -> Dict[str, Any]:
    """
    Анализ Present Participle (-ing формы)
    """
    participle = {
        "type": "present",
        "form": token.text,
        "base": token.lemma_,
        "roles": []
    }
    
    # Проверка ролей
    # 1. Часть Progressive времен (is running, was running)
    for child in token.children:
        if child.dep_ in ["aux", "auxpass"] and child.lemma_.lower() == "be":
            participle["roles"].append("progressive_tense")
            break
    
    # 2. Прилагательное (a running horse)
    if token.dep_ == "amod" or (token.head.pos_ == "NOUN" and token.dep_ in ["amod", "nmod"]):
        participle["roles"].append("adjective")
    
    # 3. Герундий (I enjoy reading)
    if token.dep_ in ["dobj", "pobj", "nsubj"] and token.head.pos_ == "VERB":
        # Проверяем контекст - если это объект глагола, это может быть герундий
        if any(child.dep_ == "prep" for child in token.head.children):
            participle["roles"].append("gerund")
    
    # 4. Абсолютная конструкция (Having finished, he left)
    # Проверяем, является ли причастие началом независимой конструкции
    if token.dep_ == "advcl" or (token.i > 0 and doc[token.i - 1].text.lower() in ["having", "being"]):
        participle["roles"].append("absolute_construction")
    
    # Если роли не определены, это может быть просто -ing форма
    if not participle["roles"]:
        participle["roles"].append("present_participle")
    
    return participle


def _analyze_past_participle(token, doc) -> Dict[str, Any]:
    """
    Анализ Past Participle
    """
    participle = {
        "type": "past",
        "form": token.text,
        "base": token.lemma_,
        "roles": []
    }
    
    # Проверка ролей
    # 1. Часть Perfect времен (has written, had written)
    for child in token.children:
        if child.dep_ in ["aux", "auxpass"]:
            if child.lemma_.lower() in ["have", "has", "had"]:
                participle["roles"].append("perfect_tense")
                break
    
    # 2. Пассивный залог (was written, is written)
    for child in token.children:
        if child.dep_ == "auxpass" and child.lemma_.lower() == "be":
            participle["roles"].append("passive_voice")
            break
    
    # 3. Прилагательное (a broken window)
    if token.dep_ == "amod" or (token.head.pos_ == "NOUN" and token.dep_ in ["amod", "nmod"]):
        participle["roles"].append("adjective")
    
    # 4. Абсолютная конструкция (Once finished, the report was submitted)
    if token.dep_ == "advcl" or (token.i > 0 and doc[token.i - 1].text.lower() in ["once", "when", "after"]):
        participle["roles"].append("absolute_construction")
    
    # Если роли не определены, это может быть просто past participle
    if not participle["roles"]:
        participle["roles"].append("past_participle")
    
    return participle

