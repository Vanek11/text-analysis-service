"""
Основной модуль для анализа текста с использованием spaCy
"""
import spacy
import os
from typing import List, Dict, Any
from ..schemas.models import (
    Token, Sentence, DependencyTree, DependencyNode, DependencyEdge
)
from ..utils.grammar_analyzer import analyze_grammar


class TextAnalyzer:
    def __init__(self, model_name: str = "en_core_web_sm"):
        """
        Инициализация анализатора с загрузкой spaCy модели
        """
        self.model_name = model_name
        try:
            self.nlp = spacy.load(model_name)
        except OSError:
            # Если модель не найдена, пытаемся загрузить через spacy.cli
            print(f"Model {model_name} not found. Please install it with:")
            print(f"python -m spacy download {model_name}")
            raise
    
    def analyze(self, text: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Основной метод анализа текста
        """
        # Ограничение длины текста
        max_length = options.get("max_length", 10000)
        if len(text) > max_length:
            text = text[:max_length]
        
        # Обработка текста через spaCy
        doc = self.nlp(text)
        
        # Извлечение токенов
        tokens = self._extract_tokens(doc, options)
        
        # Извлечение предложений
        sentences = self._extract_sentences(doc)
        
        # Построение дерева зависимостей
        dependency_tree = self._build_dependency_tree(doc)
        
        return {
            "tokens": tokens,
            "sentences": sentences,
            "dependency_tree": dependency_tree
        }
    
    def _extract_tokens(self, doc, options: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Извлечение токенов с POS-тегами и зависимостями
        """
        tokens = []
        include_morphology = options.get("include_morphology", True)
        
        for i, token in enumerate(doc):
            # Морфология
            morphology = None
            if include_morphology and token.morph:
                morphology = {}
                for feature in token.morph:
                    morphology[str(feature)] = str(token.morph.get(feature))
            
            # Зависимости
            head_id = token.head.i if token.head != token else None
            head_text = token.head.text if token.head != token else None
            
            dependency = {
                "dep": token.dep_,
                "head": head_id,
                "head_text": head_text
            }
            
            # Грамматические характеристики (для глаголов)
            grammar = analyze_grammar(token, doc)
            
            token_data = {
                "id": i,
                "text": token.text,
                "lemma": token.lemma_,
                "pos": token.pos_,
                "tag": token.tag_,
                "morphology": morphology,
                "dependency": dependency,
                "grammar": grammar
            }
            
            tokens.append(token_data)
        
        return tokens
    
    def _extract_sentences(self, doc) -> List[Dict[str, Any]]:
        """
        Извлечение предложений
        """
        sentences = []
        for sent in doc.sents:
            sentences.append({
                "start": sent.start,
                "end": sent.end,
                "text": sent.text
            })
        return sentences
    
    def _build_dependency_tree(self, doc) -> Dict[str, Any]:
        """
        Построение дерева синтаксических зависимостей
        """
        nodes = []
        edges = []
        root_id = None
        
        for token in doc:
            node = {
                "id": token.i,
                "text": token.text,
                "pos": token.pos_,
                "dep": token.dep_
            }
            nodes.append(node)
            
            # Находим корень (ROOT)
            if token.dep_ == "ROOT":
                root_id = token.i
            
            # Добавляем ребра (зависимости)
            if token.head != token:
                edge = {
                    "source": token.i,
                    "target": token.head.i,
                    "relation": token.dep_
                }
                edges.append(edge)
        
        # Если корень не найден, используем первый токен
        if root_id is None and nodes:
            root_id = 0
        
        return {
            "root": root_id,
            "nodes": nodes,
            "edges": edges
        }

