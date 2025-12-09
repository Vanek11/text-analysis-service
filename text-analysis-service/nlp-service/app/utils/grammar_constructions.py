"""
Анализ грамматических конструкций: времена, условные предложения, косвенная речь, пассивный залог
"""
from typing import List, Dict, Any, Optional
import spacy
import re


def analyze_grammar_constructions(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Анализирует грамматические конструкции в тексте
    """
    constructions = []
    
    # Анализ временных конструкций
    constructions.extend(analyze_tenses(doc, tokens))
    
    # Анализ условных предложений
    constructions.extend(analyze_conditionals(doc, tokens))
    
    # Анализ косвенной речи
    constructions.extend(analyze_reported_speech(doc, tokens))
    
    # Анализ пассивного залога
    constructions.extend(analyze_passive_voice(doc, tokens))
    
    return constructions


def analyze_tenses(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Анализирует временные конструкции (12 времен)
    """
    constructions = []
    sentences = list(doc.sents)
    
    for sent in sentences:
        sent_verbs = [token for token in sent if token.pos_ == "VERB"]
        
        for verb in sent_verbs:
            token_data = next((t for t in tokens if t["id"] == verb.i), None)
            if not token_data or not token_data.get("grammar"):
                continue
            
            grammar = token_data["grammar"]
            tense = grammar.get("tense")
            aspect = grammar.get("aspect")
            voice = grammar.get("voice")
            
            if not tense or not aspect:
                continue
            
            # Определяем полное название времени
            tense_name = _get_full_tense_name(tense, aspect, voice)
            
            constructions.append({
                "type": "tense",
                "tense_name": tense_name,
                "tense": tense,
                "aspect": aspect,
                "voice": voice or "active",
                "verb": verb.text,
                "verb_id": verb.i,
                "sentence": sent.text,
                "sentence_start": sent.start,
                "sentence_end": sent.end
            })
    
    return constructions


def _get_full_tense_name(tense: str, aspect: str, voice: str) -> str:
    """
    Формирует полное название времени
    """
    tense_map = {
        ("present", "simple", "active"): "Present Simple",
        ("present", "simple", "passive"): "Present Simple Passive",
        ("present", "progressive", "active"): "Present Continuous",
        ("present", "progressive", "passive"): "Present Continuous Passive",
        ("present", "perfect", "active"): "Present Perfect",
        ("present", "perfect", "passive"): "Present Perfect Passive",
        ("present", "perfect", "progressive"): "Present Perfect Continuous",
        ("past", "simple", "active"): "Past Simple",
        ("past", "simple", "passive"): "Past Simple Passive",
        ("past", "progressive", "active"): "Past Continuous",
        ("past", "progressive", "passive"): "Past Continuous Passive",
        ("past", "perfect", "active"): "Past Perfect",
        ("past", "perfect", "passive"): "Past Perfect Passive",
        ("past", "perfect", "progressive"): "Past Perfect Continuous",
        ("future", "simple", "active"): "Future Simple",
        ("future", "simple", "passive"): "Future Simple Passive",
        ("future", "progressive", "active"): "Future Continuous",
        ("future", "progressive", "passive"): "Future Continuous Passive",
        ("future", "perfect", "active"): "Future Perfect",
        ("future", "perfect", "passive"): "Future Perfect Passive",
        ("future", "perfect", "progressive"): "Future Perfect Continuous"
    }
    
    key = (tense, aspect, voice or "active")
    return tense_map.get(key, f"{tense.title()} {aspect.title()}")


def analyze_conditionals(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Анализирует условные предложения (Type 1, 2, 3)
    """
    constructions = []
    sentences = list(doc.sents)
    
    conditional_markers = ["if", "unless", "provided", "supposing", "as long as"]
    
    for sent in sentences:
        sent_text = sent.text.lower()
        
        # Проверяем наличие маркеров условных предложений
        has_conditional = any(marker in sent_text for marker in conditional_markers)
        if not has_conditional:
            continue
        
        # Находим глаголы в предложении
        verbs = [token for token in sent if token.pos_ == "VERB"]
        if len(verbs) < 2:
            continue
        
        # Определяем тип условного предложения по временам глаголов
        conditional_type = _determine_conditional_type(sent, verbs, tokens)
        
        if conditional_type:
            constructions.append({
                "type": "conditional",
                "conditional_type": conditional_type,
                "sentence": sent.text,
                "sentence_start": sent.start,
                "sentence_end": sent.end
            })
    
    return constructions


def _determine_conditional_type(sent, verbs: List, tokens: List[Dict[str, Any]]) -> Optional[str]:
    """
    Определяет тип условного предложения
    """
    verb_tenses = []
    for verb in verbs:
        token_data = next((t for t in tokens if t["id"] == verb.i), None)
        if token_data and token_data.get("grammar"):
            tense = token_data["grammar"].get("tense")
            if tense:
                verb_tenses.append(tense)
    
    # Type 1: If + Present, Future/Modal
    if "present" in verb_tenses and ("future" in verb_tenses or any("will" in str(v) for v in verbs)):
        return "type_1"
    
    # Type 2: If + Past Simple, would/could/might + infinitive
    if "past" in verb_tenses:
        modal_verbs = [v for v in verbs if v.lemma_.lower() in ["would", "could", "might"]]
        if modal_verbs:
            return "type_2"
    
    # Type 3: If + Past Perfect, would have + past participle
    # Это сложнее определить, нужен более глубокий анализ
    # Пока возвращаем None для неопределенных случаев
    
    return None


def analyze_reported_speech(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Анализирует косвенную речь
    """
    constructions = []
    sentences = list(doc.sents)
    
    reporting_verbs = ["say", "tell", "ask", "reply", "answer", "explain", "suggest", "claim", "report"]
    
    for sent in sentences:
        # Ищем глаголы сообщения
        reporting_verb = None
        for token in sent:
            if token.pos_ == "VERB" and token.lemma_.lower() in reporting_verbs:
                reporting_verb = token
                break
        
        if not reporting_verb:
            continue
        
        # Проверяем наличие that или вопросительных слов
        has_that = any(token.text.lower() == "that" for token in sent)
        has_question_word = any(token.text.lower() in ["what", "who", "where", "when", "why", "how"] 
                                for token in sent if token.pos_ in ["WP", "WRB"])
        
        if has_that or has_question_word:
            constructions.append({
                "type": "reported_speech",
                "reporting_verb": reporting_verb.text,
                "verb_id": reporting_verb.i,
                "sentence": sent.text,
                "sentence_start": sent.start,
                "sentence_end": sent.end
            })
    
    return constructions


def analyze_passive_voice(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Анализирует пассивный залог
    """
    constructions = []
    sentences = list(doc.sents)
    
    for sent in sentences:
        verbs = [token for token in sent if token.pos_ == "VERB"]
        
        for verb in verbs:
            token_data = next((t for t in tokens if t["id"] == verb.i), None)
            if not token_data:
                continue
            
            # Проверяем пассивный залог
            grammar = token_data.get("grammar")
            if grammar and grammar.get("voice") == "passive":
                # Проверяем наличие вспомогательного глагола be
                has_be = any(child.lemma_.lower() == "be" for child in verb.children 
                            if child.dep_ in ["aux", "auxpass"])
                
                constructions.append({
                    "type": "passive_voice",
                    "verb": verb.text,
                    "verb_id": verb.i,
                    "tense": grammar.get("tense"),
                    "aspect": grammar.get("aspect"),
                    "sentence": sent.text,
                    "sentence_start": sent.start,
                    "sentence_end": sent.end
                })
    
    return constructions

