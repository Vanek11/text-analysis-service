from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class AnalysisOptions(BaseModel):
    include_morphology: bool = True
    include_entities: bool = False
    max_length: int = 10000


class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=100000)
    options: Optional[AnalysisOptions] = AnalysisOptions()


class Morphology(BaseModel):
    pass  # Will be populated dynamically based on spaCy morphology


class Dependency(BaseModel):
    dep: str
    head: Optional[int]
    head_text: Optional[str]


class Grammar(BaseModel):
    tense: Optional[str] = None
    aspect: Optional[str] = None
    voice: Optional[str] = None


class VerbType(BaseModel):
    type: str  # regular, modal, auxiliary, phrasal
    modal: Optional[Dict[str, Any]] = None
    auxiliary: Optional[bool] = None
    auxiliary_type: Optional[str] = None
    phrasal: Optional[Dict[str, Any]] = None


class Participle(BaseModel):
    type: str  # present or past
    form: str
    base: str
    roles: List[str]


class AdverbClassification(BaseModel):
    semantic: str  # manner, time, place, frequency, degree, sentence
    morphological: str  # simple, derived, compound, phrasal
    modifies: Optional[Dict[str, Any]] = None
    position: str  # beginning, middle, end


class AdjectiveDegree(BaseModel):
    degree: str  # positive, comparative, superlative
    base_form: str
    is_irregular: bool


class AdjectiveAnalysis(BaseModel):
    type: str  # descriptive, quantitative, demonstrative, possessive, interrogative, distributive, indefinite
    degree: AdjectiveDegree
    formation_rules: Dict[str, Any]


class PrepositionalPhrase(BaseModel):
    preposition: str
    object: Optional[str] = None
    object_pos: Optional[str] = None
    modifiers: List[Dict[str, Any]] = []
    full_phrase: str


class PrepositionAnalysis(BaseModel):
    type: str  # time, place, direction, agent, instrument, purpose, etc.
    prepositional_phrase: PrepositionalPhrase
    is_multiword: bool


class Token(BaseModel):
    id: int
    text: str
    lemma: str
    pos: str
    tag: str
    morphology: Optional[Dict[str, Any]] = None
    dependency: Dependency
    grammar: Optional[Grammar] = None
    verb_type: Optional[VerbType] = None
    participle: Optional[Participle] = None
    adverb_classification: Optional[AdverbClassification] = None
    adjective_analysis: Optional[AdjectiveAnalysis] = None
    preposition_analysis: Optional[PrepositionAnalysis] = None


class Sentence(BaseModel):
    start: int
    end: int
    text: str


class DependencyNode(BaseModel):
    id: int
    text: str
    pos: str
    dep: str


class DependencyEdge(BaseModel):
    source: int
    target: int
    relation: str


class DependencyTree(BaseModel):
    root: int
    nodes: List[DependencyNode]
    edges: List[DependencyEdge]


class GrammarError(BaseModel):
    type: str
    severity: str  # error, warning
    message: str
    token_id: Optional[int] = None
    subject_id: Optional[int] = None
    sentence: Optional[str] = None
    suggestion: Optional[str] = None


class Statistics(BaseModel):
    pos_distribution: Dict[str, int]
    participles: Dict[str, int]
    verbs: Dict[str, int]
    adverbs: Dict[str, Any]
    adjectives: Optional[Dict[str, Any]] = None
    prepositions: Optional[Dict[str, Any]] = None


class GrammarConstruction(BaseModel):
    type: str  # tense, conditional, reported_speech, passive_voice
    tense_name: Optional[str] = None
    tense: Optional[str] = None
    aspect: Optional[str] = None
    voice: Optional[str] = None
    conditional_type: Optional[str] = None
    reporting_verb: Optional[str] = None
    verb: Optional[str] = None
    verb_id: Optional[int] = None
    sentence: str
    sentence_start: int
    sentence_end: int


class NestedPrepositionalPhrase(BaseModel):
    outer_preposition: str
    outer_object: str
    inner_preposition: str
    inner_object: Optional[str] = None
    sentence: str


class ComplexityMetrics(BaseModel):
    average_sentence_length: float
    average_dependency_depth: float
    complexity_coefficient: float
    lexical_diversity: Dict[str, Any]
    flesch_kincaid: Dict[str, Any]
    readability_level: Dict[str, Any]
    sentence_count: int
    word_count: int
    syllable_count: int
    character_count: int


class AnalysisResponse(BaseModel):
    tokens: List[Token]
    sentences: List[Sentence]
    dependency_tree: DependencyTree
    statistics: Optional[Statistics] = None
    grammar_errors: Optional[List[GrammarError]] = None
    grammar_constructions: Optional[List[GrammarConstruction]] = None
    nested_prepositional_phrases: Optional[List[NestedPrepositionalPhrase]] = None
    complexity_metrics: Optional[ComplexityMetrics] = None

