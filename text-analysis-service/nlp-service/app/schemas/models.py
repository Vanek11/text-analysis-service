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


class Token(BaseModel):
    id: int
    text: str
    lemma: str
    pos: str
    tag: str
    morphology: Optional[Dict[str, Any]] = None
    dependency: Dependency
    grammar: Optional[Grammar] = None


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


class AnalysisResponse(BaseModel):
    tokens: List[Token]
    sentences: List[Sentence]
    dependency_tree: DependencyTree

