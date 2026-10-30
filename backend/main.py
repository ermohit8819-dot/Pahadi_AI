import os
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models import ChatRequest, ChatResponse, DocumentUploadRequest, TelephonyWebhookRequest
from .services_db import init_db, seed_sample_services, get_all_services
from .rag import rag_engine
from .gemini_service import generate_gov_response
from .telephony import TelephonyAdapter

load_dotenv()

app = FastAPI(
    title="Pahadi SevaVaani Backend",
    description="AI Voice Assistant API for Uttarakhand Government Services",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_sample_services()

@app.get("/")
def read_root():
    return {
        "project": "Pahadi SevaVaani",
        "tagline": "Apni Bhasha, Apni Sarkar",
        "state": "Uttarakhand",
        "portal": "https://eservices.uk.gov.in",
        "status": "online"
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    # 1. RAG search
    chunks = rag_engine.search(req.message, top_k=3)
    
    # 2. Gemini response
    reply = generate_gov_response(req.message, req.language, chunks)
    
    # 3. Match service
    all_svcs = get_all_services()
    matched = None
    for s in all_svcs:
        if s["id"] in req.message.lower() or "आय" in req.message:
            matched = s
            break
            
    is_demo = req.language in ["garhwali", "kumaoni"]
    
    return ChatResponse(
        reply=reply,
        language=req.language,
        matched_service=matched,
        sources=[{"title": c["title"], "url": c["source_url"], "department": c["department"]} for c in chunks],
        is_demonstration=is_demo
    )

@app.get("/api/services")
def list_services():
    return {"services": get_all_services()}

@app.post("/api/telephony/incoming-call")
def telephony_incoming():
    welcome_text = "नमस्कार! उत्तराखण्ड सरकार की पहाड़ी सेवावाणी में आपका स्वागत है। आय या जाति प्रमाण पत्र हेतु 1 दबाएं अथवा बोलें।"
    twiml = TelephonyAdapter.build_twilio_twiml(welcome_text)
    return Response(content=twiml, media_type="text/xml")

@app.post("/api/telephony/process-speech")
def telephony_process(data: TelephonyWebhookRequest):
    speech = data.SpeechResult or "आय प्रमाण पत्र"
    chunks = rag_engine.search(speech)
    reply = generate_gov_response(speech, "hi", chunks)
    twiml = TelephonyAdapter.build_twilio_twiml(reply)
    return Response(content=twiml, media_type="text/xml")
