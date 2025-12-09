"""
Проверка грамматики: Subject-Verb Agreement, Articles, Tense Consistency
"""
from typing import List, Dict, Any, Optional
import spacy


def check_grammar(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Выполняет проверку грамматики и возвращает список ошибок и предупреждений
    """
    errors = []
    
    # Проверка Subject-Verb Agreement
    errors.extend(check_subject_verb_agreement(doc, tokens))
    
    # Проверка использования артиклей
    errors.extend(check_article_usage(doc, tokens))
    
    # Проверка согласованности времен
    errors.extend(check_tense_consistency(doc, tokens))
    
    return errors


def check_subject_verb_agreement(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Проверка согласования подлежащего и сказуемого
    """
    errors = []
    
    for token in doc:
        if token.pos_ == "VERB" and token.dep_ == "ROOT":
            # Находим подлежащее
            subject = None
            for child in token.children:
                if child.dep_ in ["nsubj", "nsubjpass"]:
                    subject = child
                    break
            
            if subject:
                # Проверяем число подлежащего
                subject_number = _get_number(subject)
                verb_number = _get_verb_number(token, doc)
                
                if subject_number and verb_number and subject_number != verb_number:
                    errors.append({
                        "type": "subject_verb_agreement",
                        "severity": "error",
                        "message": f"Subject-verb disagreement: '{subject.text}' ({subject_number}) with '{token.text}' ({verb_number})",
                        "token_id": token.i,
                        "subject_id": subject.i,
                        "suggestion": _suggest_verb_correction(token, subject_number)
                    })
    
    return errors


def check_article_usage(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Проверка использования артиклей
    """
    errors = []
    
    for i, token in enumerate(doc):
        # Проверяем существительные без артиклей
        if token.pos_ == "NOUN" and token.tag_ in ["NN", "NNS"]:
            # Проверяем, есть ли артикль перед существительным
            has_article = False
            for j in range(max(0, i - 3), i):
                if doc[j].tag_ in ["DT", "PDT"]:
                    has_article = True
                    break
            
            # Исключения: имена собственные, множественное число в общем смысле, неисчисляемые существительные
            if not has_article and not _is_proper_noun(token) and not _is_plural_generic(token):
                # Проверяем контекст - может быть это часть составного существительного
                if not _is_part_of_compound(token, doc):
                    errors.append({
                        "type": "article_usage",
                        "severity": "warning",
                        "message": f"Missing article before '{token.text}'",
                        "token_id": token.i,
                        "suggestion": f"Consider adding 'a', 'an', or 'the' before '{token.text}'"
                    })
    
    return errors


def check_tense_consistency(doc, tokens: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Проверка согласованности времен в предложении
    """
    errors = []
    
    sentences = list(doc.sents)
    
    # Создаем словарь для быстрого доступа к данным токенов
    tokens_dict = {t["id"]: t for t in tokens}
    
    for sent in sentences:
        verbs = [token for token in sent if token.pos_ == "VERB"]
        if len(verbs) < 2:
            continue
        
        tenses = []
        for verb in verbs:
            # Получаем информацию о времени из токена
            token_data = tokens_dict.get(verb.i)
            if token_data and token_data.get("grammar") and token_data["grammar"].get("tense"):
                tenses.append((verb.i, token_data["grammar"]["tense"]))
        
        # Проверяем согласованность времен
        if len(tenses) >= 2:
            # Простая проверка: если есть past и present в одном предложении без причины
            past_verbs = [t for t in tenses if t[1] == "past"]
            present_verbs = [t for t in tenses if t[1] == "present"]
            
            if past_verbs and present_verbs:
                # Это может быть нормально (например, в условных предложениях)
                # Но мы выдаем предупреждение
                errors.append({
                    "type": "tense_consistency",
                    "severity": "warning",
                    "message": f"Mixed tenses in sentence: past and present tenses found",
                    "sentence": sent.text,
                    "suggestion": "Check if tense consistency is intentional"
                })
    
    return errors


def _get_number(token) -> Optional[str]:
    """
    Определяет число токена (singular/plural)
    """
    if token.morph:
        number = token.morph.get("Number")
        if number:
            return str(number).lower()
    
    # Эвристики
    if token.tag_ in ["NNS", "NNPS"]:
        return "plural"
    elif token.tag_ in ["NN", "NNP"]:
        return "singular"
    
    return None


def _get_verb_number(verb, doc) -> Optional[str]:
    """
    Определяет число глагола
    """
    if verb.morph:
        number = verb.morph.get("Number")
        if number:
            return str(number).lower()
    
    # Проверяем форму глагола
    if verb.tag_ in ["VBZ"]:  # 3rd person singular
        return "singular"
    elif verb.tag_ in ["VBP", "VB"]:  # non-3rd person singular or plural
        return "plural"
    
    return None


def _suggest_verb_correction(verb, correct_number: str) -> str:
    """
    Предлагает исправление глагола
    """
    if correct_number == "singular":
        if verb.tag_ == "VBP":
            return f"Consider using '{verb.lemma_}s' (3rd person singular)"
    elif correct_number == "plural":
        if verb.tag_ == "VBZ":
            return f"Consider using '{verb.lemma_}' (plural form)"
    
    return "Check subject-verb agreement"


def _is_proper_noun(token) -> bool:
    """
    Проверяет, является ли токен именем собственным
    """
    return token.tag_ in ["NNP", "NNPS"]


def _is_plural_generic(token) -> bool:
    """
    Проверяет, является ли существительное множественным числом в общем смысле
    """
    return token.tag_ == "NNS"


def _is_part_of_compound(token, doc) -> bool:
    """
    Проверяет, является ли токен частью составного существительного
    """
    # Проверяем, есть ли зависимые слова
    if token.dep_ == "compound":
        return True
    
    # Проверяем, является ли токен зависимым от другого существительного
    if token.head.pos_ == "NOUN" and token.dep_ in ["compound", "nmod"]:
        return True
    
    return False

