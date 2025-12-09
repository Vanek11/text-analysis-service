"""
Анализ грамматических характеристик: времена, залоги, вид
"""
from typing import Optional, Dict, Any
import spacy


def analyze_grammar(token, doc) -> Optional[Dict[str, Any]]:
    """
    Анализирует грамматические характеристики глагола:
    - tense (время)
    - aspect (вид)
    - voice (залог)
    """
    if token.pos_ != "VERB":
        return None
    
    grammar = {
        "tense": None,
        "aspect": None,
        "voice": None
    }
    
    # Определение времени на основе POS-тега
    tag = token.tag_
    
    # Прошедшее время
    if tag in ["VBD", "VBN"]:
        grammar["tense"] = "past"
    # Настоящее время
    elif tag in ["VBZ", "VBP", "VB"]:
        grammar["tense"] = "present"
    # Будущее время (определяется по вспомогательным глаголам)
    elif tag == "MD":
        grammar["tense"] = "future"
    
    # Определение вида (aspect)
    # Simple
    if tag in ["VBD", "VBZ", "VBP", "VB"]:
        grammar["aspect"] = "simple"
    # Progressive/Continuous (VBG)
    elif tag == "VBG":
        grammar["aspect"] = "progressive"
    # Perfect (VBN с have/has/had)
    elif tag == "VBN":
        # Проверяем наличие вспомогательного глагола have/has/had
        for child in token.children:
            if child.lemma_.lower() in ["have", "has", "had"]:
                grammar["aspect"] = "perfect"
                break
        if grammar["aspect"] is None:
            grammar["aspect"] = "simple"  # Past participle без have = passive или past simple
    
    # Определение залога (voice)
    # Пассивный залог: nsubjpass или наличие be + VBN
    if "nsubjpass" in [child.dep_ for child in token.children]:
        grammar["voice"] = "passive"
    # Проверка на be + past participle
    elif tag == "VBN":
        for child in token.children:
            if child.lemma_.lower() == "be" and child.dep_ == "auxpass":
                grammar["voice"] = "passive"
                break
        if grammar["voice"] is None:
            grammar["voice"] = "active"
    else:
        grammar["voice"] = "active"
    
    # Улучшенное определение времени для сложных конструкций
    if grammar["tense"] is None:
        # Проверяем вспомогательные глаголы
        for child in token.children:
            if child.dep_ in ["aux", "auxpass"]:
                aux_tag = child.tag_
                if aux_tag == "MD":  # will, would, can, etc.
                    grammar["tense"] = "future"
                elif aux_tag in ["VBD", "VBN"]:  # had, was, were
                    grammar["tense"] = "past"
                elif aux_tag in ["VBZ", "VBP"]:  # has, have, is, are
                    grammar["tense"] = "present"
                break
    
    return grammar

