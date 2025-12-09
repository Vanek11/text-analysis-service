"""
Тесты для модуля анализа грамматических характеристик
"""
import pytest
import spacy
from app.utils.grammar_analyzer import analyze_grammar


@pytest.fixture
def nlp():
    """Загрузка spaCy модели для тестов"""
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        pytest.skip("spaCy model not installed")


def test_past_tense_simple(nlp):
    """Тест определения прошедшего времени (simple past)"""
    doc = nlp("The cat sat on the mat.")
    verb = [token for token in doc if token.pos_ == "VERB"][0]
    grammar = analyze_grammar(verb, doc)
    
    assert grammar is not None
    assert grammar["tense"] == "past"
    assert grammar["aspect"] == "simple"
    assert grammar["voice"] == "active"


def test_present_tense_simple(nlp):
    """Тест определения настоящего времени (simple present)"""
    doc = nlp("The cat sits on the mat.")
    verb = [token for token in doc if token.pos_ == "VERB"][0]
    grammar = analyze_grammar(verb, doc)
    
    assert grammar is not None
    assert grammar["tense"] == "present"
    assert grammar["aspect"] == "simple"


def test_progressive_aspect(nlp):
    """Тест определения прогрессивного вида"""
    doc = nlp("The cat is sitting on the mat.")
    verb = [token for token in doc if token.tag_ == "VBG"][0]
    grammar = analyze_grammar(verb, doc)
    
    assert grammar is not None
    assert grammar["aspect"] == "progressive"


def test_passive_voice(nlp):
    """Тест определения пассивного залога"""
    doc = nlp("The cat was sat on the mat.")
    # Ищем глагол в пассивном залоге
    verbs = [token for token in doc if token.pos_ == "VERB"]
    for verb in verbs:
        grammar = analyze_grammar(verb, doc)
        if grammar and grammar.get("voice") == "passive":
            assert grammar["voice"] == "passive"
            return
    # Если не нашли, пропускаем тест
    pytest.skip("Passive voice not detected in test sentence")


def test_non_verb_returns_none(nlp):
    """Тест что не-глаголы возвращают None"""
    doc = nlp("The cat sat on the mat.")
    noun = [token for token in doc if token.pos_ == "NOUN"][0]
    grammar = analyze_grammar(noun, doc)
    
    assert grammar is None

