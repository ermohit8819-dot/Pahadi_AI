# Pahadi SevaVaani (पहाड़ी सेवावाणी)
### AI Voice Assistant for Uttarakhand Government Services
> **"Apni Bhasha, Apni Sarkar."** (अपनी भाषा, अपनी सरकार)  
> *Developed for PRAYAS 2026 Hackathon, Uttarakhand*

---

## 🏔️ 1. Project Overview

**Pahadi SevaVaani** is a regional-language conversational AI voice assistant engineered to make Uttarakhand citizen government services universally accessible across all 13 hill and plain districts.

Targeting the official **Apuni Sarkar (eservices.uk.gov.in)** platform, the assistant allows citizens to ask questions verbally or via text in:
- **Hindi (हिन्दी)**
- **Garhwali (गढ़वाली)**
- **Kumaoni (कुमाऊँनी)**
- **English**

Citizens receive accurate eligibility criteria, required document checklists, government fees, and legally mandated delivery timelines under the **Uttarakhand Right to Service Act 2011 (उत्तराखण्ड सेवा का अधिकार अधिनियम)**.

---

## 🏛️ 2. Key Capabilities & Citizen Journeys

1. **Tap & Speak Voice Assistant**:
   - Hands-free microphone button with live speech-to-text.
   - Grounded context-aware responses with citations to official circulars.
   - Natural text-to-speech voice playback in conversational Pahadi cadence.
2. **Apuni Sarkar Services Directory**:
   - Complete checklists and fee breakdown for Income, Caste (SC/ST/OBC), Domicile (Mool Niwas), Old Age Pension, Ration Cards (NFSA), Farmer Welfare (PM-Kisan & Polyhouse subsidy), Employment Exchange, and CSC Locator.
3. **Ordinary Phone Call Integration (IVR)**:
   - Designed for citizens in remote hill villages with ordinary keypad phones or landlines.
   - Exotel & Twilio compatible telephony webhook architecture (`/api/telephony/incoming-call` and `/api/telephony/process-speech`).
   - Interactive in-browser phone handset simulator to test dialing `1800-180-4100` toll-free.
4. **Admin Knowledge Base & RAG System**:
   - Upload official government circulars, guidelines, and FAQs.
   - Document chunking, vector embeddings, and real-time retrieval scoring.
   - Live RAG semantic search inspector and citizen query usage metrics.

---

## 🛠️ 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS (v4), Lucide Icons, Web Speech API (SpeechRecognition & SpeechSynthesis).
- **Backend**:
  - Full-stack Express server (`server.ts`) for unified deployment on port 3000.
  - Complete Python FastAPI backend in `/backend/` directory (`main.py`, `rag.py`, `telephony.py`, `services_db.py`, `requirements.txt`).
- **AI & LLM**: Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript & Python SDKs.
- **Knowledge Retrieval (RAG)**: In-memory vector embeddings and BM25 token matcher with ChromaDB compatibility.
- **Telephony Ready**: Exotel NCCO and Twilio TwiML standard XML/JSON speech handlers.

---

## 🚀 4. Setup & Running Instructions

### A. Web Application (React + Express Full-Stack)
```bash
# 1. Install dependencies
npm install

# 2. Configure Environment Variables
cp .env.example .env
# Set GEMINI_API_KEY="your_google_gemini_api_key"

# 3. Start development server
npm run dev

# 4. Run pure logic unit tests
npm test
```
The application will launch at `http://localhost:3000`.

### B. Standalone Python FastAPI Backend (Alternative Submission)
```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📞 5. Telephony Setup (Exotel / Twilio)

1. Provision an inbound phone number or toll-free DID on Exotel or Twilio.
2. In your telephony dashboard, set the **Inbound Voice Webhook URL** to:
   ```
   POST https://<your-domain>/api/telephony/incoming-call
   ```
3. Set the **Gather/Speech Action URL** to:
   ```
   POST https://<your-domain>/api/telephony/process-speech
   ```
4. Test using the built-in **Phone Simulator** tab inside the web interface.

---

## 📜 6. Compliance & Safety

- **No Hallucinations**: Uses RAG retrieval over verified Uttarakhand government documents; explicitly identifies demonstration mode for dialect expansions.
- **No API Key Exposure**: All Gemini calls run server-side.
- **Zero Invasiveness**: Microphone activates strictly upon explicit user interaction ("Tap and Speak").

---
*Created for PRAYAS 2026 Hackathon, Uttarakhand | Government of Uttarakhand*
