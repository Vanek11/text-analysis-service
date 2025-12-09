"""
FastAPI приложение для NLP сервиса
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import structlog
from .schemas.models import AnalysisRequest, AnalysisResponse
from .models.analyzer import TextAnalyzer

# Настройка логирования
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()

# Инициализация FastAPI
app = FastAPI(
    title="English Text Analysis Service",
    description="NLP service for English text analysis with POS tagging, dependency parsing, and grammar analysis",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене нужно ограничить
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация анализатора
model_name = os.getenv("SPACY_MODEL", "en_core_web_sm")
try:
    analyzer = TextAnalyzer(model_name)
    logger.info("Text analyzer initialized", model=model_name)
except Exception as e:
    logger.error("Failed to initialize analyzer", error=str(e))
    analyzer = None


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if analyzer is None:
        raise HTTPException(status_code=503, detail="NLP model not loaded")
    return {
        "status": "healthy",
        "model": model_name
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    Анализ английского текста
    """
    if analyzer is None:
        raise HTTPException(status_code=503, detail="NLP service unavailable")
    
    try:
        logger.info("Analyzing text", text_length=len(request.text))
        
        options = request.options.dict() if request.options else {}
        result = analyzer.analyze(request.text, options)
        
        logger.info("Analysis completed", tokens_count=len(result["tokens"]))
        
        return AnalysisResponse(**result)
    
    except Exception as e:
        logger.error("Analysis error", error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

