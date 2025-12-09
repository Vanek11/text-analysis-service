"""
Тесты для основного модуля анализатора
"""
import pytest
from app.models.analyzer import TextAnalyzer


@pytest.fixture
def analyzer():
    """Создание экземпляра анализатора"""
    try:
        return TextAnalyzer("en_core_web_sm")
    except OSError:
        pytest.skip("spaCy model not installed")


def test_analyze_basic(analyzer):
    """Базовый тест анализа текста"""
    text = "The cat sat on the mat."
    options = {"include_morphology": True, "max_length": 10000}
    
    result = analyzer.analyze(text, options)
    
    assert "tokens" in result
    assert "sentences" in result
    assert "dependency_tree" in result
    assert len(result["tokens"]) > 0
    assert len(result["sentences"]) > 0


def test_token_structure(analyzer):
    """Тест структуры токенов"""
    text = "The cat sat."
    options = {"include_morphology": True}
    
    result = analyzer.analyze(text, options)
    token = result["tokens"][0]
    
    assert "id" in token
    assert "text" in token
    assert "lemma" in token
    assert "pos" in token
    assert "tag" in token
    assert "dependency" in token


def test_dependency_tree_structure(analyzer):
    """Тест структуры дерева зависимостей"""
    text = "The cat sat on the mat."
    options = {}
    
    result = analyzer.analyze(text, options)
    tree = result["dependency_tree"]
    
    assert "root" in tree
    assert "nodes" in tree
    assert "edges" in tree
    assert isinstance(tree["nodes"], list)
    assert isinstance(tree["edges"], list)


def test_max_length_limit(analyzer):
    """Тест ограничения максимальной длины"""
    long_text = "The cat sat. " * 1000
    options = {"max_length": 100}
    
    result = analyzer.analyze(long_text, options)
    
    # Проверяем что текст был обрезан
    assert len(result["tokens"]) < len(long_text.split())


def test_sentences_extraction(analyzer):
    """Тест извлечения предложений"""
    text = "The cat sat. The dog ran."
    options = {}
    
    result = analyzer.analyze(text, options)
    
    assert len(result["sentences"]) == 2
    assert result["sentences"][0]["text"].strip() == "The cat sat."
    assert result["sentences"][1]["text"].strip() == "The dog ran."

