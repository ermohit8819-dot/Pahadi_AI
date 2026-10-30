from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., description="User voice query or typed question")
    language: str = Field(default="hi", description="Language code: hi, garhwali, kumaoni, en")
    history: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="Recent conversation turns")

class ChatResponse(BaseModel):
    reply: str
    language: str
    matched_service: Optional[Dict[str, Any]] = None
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    confidence: float = 0.95
    is_demonstration: bool = False

class DocumentUploadRequest(BaseModel):
    title: str
    department: str
    category: str
    content: str
    source_url: Optional[str] = "https://eservices.uk.gov.in"
    file_type: Optional[str] = "guideline"

class TelephonyWebhookRequest(BaseModel):
    CallSid: Optional[str] = None
    From: Optional[str] = None
    To: Optional[str] = None
    SpeechResult: Optional[str] = None
    Digits: Optional[str] = None
