import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { OFFICIAL_SERVICES, INITIAL_GOVERNMENT_DOCUMENTS } from './src/data/servicesData.ts';
import { retrieveGovKnowledge, buildGroundedPrompt, matchService } from './src/utils/ragEngine.ts';
import { SupportedLanguage, GovernmentDocument, UsageStats } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory persistent knowledge store & telemetry for prototype
let governmentDocuments: GovernmentDocument[] = [...INITIAL_GOVERNMENT_DOCUMENTS];
const usageStats: UsageStats = {
  totalQueries: 48,
  voiceQueries: 35,
  languagesUsed: {
    hi: 32,
    garhwali: 8,
    kumaoni: 6,
    en: 2,
  },
  topServices: [
    { serviceId: 'income-cert', name: 'आय प्रमाण पत्र', count: 21 },
    { serviceId: 'caste-cert', name: 'जाति प्रमाण पत्र', count: 12 },
    { serviceId: 'domicile-cert', name: 'मूल निवास प्रमाण पत्र', count: 8 },
    { serviceId: 'old-age-pension', name: 'वृद्धावस्था पेंशन', count: 5 },
    { serviceId: 'farmer-schemes', name: 'किसान कल्याण योजनाएं', count: 2 },
  ],
  activeCallSessions: 0,
};

// Initialize Gemini SDK with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for deterministic response if Gemini is unavailable
function getDeterministicFallback(query: string, language: SupportedLanguage, matchedService: any): string {
  if (matchedService) {
    if (language === 'garhwali') {
      return `नमस्ते दाज्यू/भुल्या! मैं अंजलि छौं। ${matchedService.name.garhwali || matchedService.name.hi} खातिर पक्का नियम यो च:
• ⏱️ समय सीमा: ${matchedService.timelineDays} दिन (सेवा का अधिकार कानून)
• 💰 सरकारी खर्चा: ${matchedService.officialFee}
• 📄 जरूरी कागज: ${matchedService.requiredDocuments.slice(0, 4).join(', ')}
• 🔗 आवेदन लिंक: अपणि सरकार पोर्टल (https://eservices.uk.gov.in/) पर अर्जी लगा सकदा छा या नजदीकी सीएससी केंद्र जा सकदा छा।`;
    }
    if (language === 'kumaoni') {
      return `पैलाग दाज्यू/बैणी! मैं अंजलि छू। ${matchedService.name.kumaoni || matchedService.name.hi} खातिर जरूरी जानकारी:
• ⏱️ समय सीमा: ${matchedService.timelineDays} दिनक भीतर प्रमाणपत्र मिल जाल
• 💰 सरकारी फीस: ${matchedService.officialFee}
• 📄 खास कागज: ${matchedService.requiredDocuments.slice(0, 4).join(', ')}
• 🔗 आवेदन लिंक: अपणि सरकार आधिकारिक पोर्टल (https://eservices.uk.gov.in/) बटि ऑनलाइन अर्जी दिहा।`;
    }
    if (language === 'en') {
      return `Hello! I am Anjali from Apuni Sarkar. Here are the exact official details for ${matchedService.name.en}:
• ⏱️ Timeline: ${matchedService.timelineDays} working days under Uttarakhand Right to Service Act.
• 💰 Official Fee: ${matchedService.officialFee}.
• 📄 Required Documents: ${matchedService.requiredDocuments.slice(0, 4).join(', ')}.
• 🔗 Official Portal: Apply online directly at https://eservices.uk.gov.in/ or visit your nearest CSC Center.`;
    }
    return `नमस्ते! मैं अंजलि हूँ, उत्तराखण्ड अपणि सरकार से। ${matchedService.name.hi} के लिए मुख्य जानकारी इस प्रकार है:
• ⏱️ समय सीमा: ${matchedService.timelineDays} कार्यदिवस (सेवा का अधिकार अधिनियम 2011)
• 💰 सरकारी शुल्क: ${matchedService.officialFee}
• 📄 आवश्यक दस्तावेज: ${matchedService.requiredDocuments.slice(0, 4).join(', ')}
• 🔗 आधिकारिक आवेदन लिंक: आप अपणि सरकार पोर्टल (https://eservices.uk.gov.in/) पर सीधे ऑनलाइन आवेदन कर सकते हैं अथवा नजदीकी सीएससी केंद्र जा सकते हैं।`;
  }

  // If query is outside verified services, redirect to portal
  return `नमस्ते! मैं अंजलि हूँ। यह विशिष्ट जानकारी अपणि सरकार के सत्यापित डेटाबेस में नहीं मिली।
कृपया उत्तराखण्ड सरकार के आधिकारिक पोर्टल पर जाएं:
🔗 https://eservices.uk.gov.in/
वहां 250 से अधिक सेवाएं, आवेदन स्थिति और प्रमाण पत्र सत्यापन उपलब्ध है।`;
}

// 1. Chat endpoint with Gemini & RAG
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'hi', history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const currentLang = (language as SupportedLanguage) || 'hi';

    // Update stats
    usageStats.totalQueries++;
    usageStats.languagesUsed[currentLang] = (usageStats.languagesUsed[currentLang] || 0) + 1;

    // RAG retrieval prioritizing exact snippets from eservices.uk.gov.in
    const ragResult = retrieveGovKnowledge(message, governmentDocuments, OFFICIAL_SERVICES);
    const { systemInstruction, userPrompt } = buildGroundedPrompt(message, currentLang, ragResult, history);

    // If confidence score is low, DO NOT attempt an uncertain/hallucinated answer!
    // Explicitly provide a direct, hyperlinked URL to the official service page on eservices.uk.gov.in
    if (ragResult.isLowConfidence) {
      const redirectUrl = ragResult.directOfficialUrl || 'https://eservices.uk.gov.in/';
      const lowConfidenceReply = `आधिकारिक अपणि सरकार (eservices.uk.gov.in) पोर्टल पर इस प्रश्न का पर्याप्त उच्च-विश्वसनीयता रिकॉर्ड नहीं मिला।

अपूर्ण या अनुमानित जानकारी देने के स्थान पर, कृपया सीधे आधिकारिक सेवा पोर्टल पर जाएं:
🔗 ${redirectUrl}

वहां उत्तराखण्ड शासन की 250+ अधिसूचित सेवाओं के आधिकारिक आवेदन फॉर्म, नियमावली, आवश्यक दस्तावेज एवं स्थिति ट्रैकिंग उपलब्ध है।`;

      return res.json({
        reply: lowConfidenceReply,
        language: currentLang,
        matchedService: null,
        sources: [
          {
            title: 'अपणि सरकार आधिकारिक सेवा पोर्टल',
            url: redirectUrl,
            department: 'उत्तराखण्ड शासन (eservices.uk.gov.in)',
            isVerified: true,
          },
        ],
        retrievedChunks: [],
        confidenceScore: ragResult.confidenceScore,
        isLowConfidence: true,
        directOfficialUrl: redirectUrl,
        usedGemini: false,
      });
    }

    if (ragResult.matchedService) {
      const existing = usageStats.topServices.find(s => s.serviceId === ragResult.matchedService?.id);
      if (existing) {
        existing.count++;
      } else {
        usageStats.topServices.push({
          serviceId: ragResult.matchedService.id,
          name: ragResult.matchedService.name.hi,
          count: 1,
        });
      }
    }

    let reply = '';
    let usedGemini = false;

    // Try calling Gemini if API key is provided and not placeholder
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
          },
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );
        const geminiRes: any = await Promise.race([geminiPromise, timeoutPromise]);
        if (geminiRes?.text) {
          reply = geminiRes.text.trim();
          usedGemini = true;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call warning (using verified grounded fallback):', geminiError?.message);
      }
    }

    // High confidence deterministic fallback
    if (!reply) {
      reply = getDeterministicFallback(message, currentLang, ragResult.matchedService);
    }

    return res.json({
      reply,
      language: currentLang,
      matchedService: ragResult.matchedService,
      sources: ragResult.sources,
      retrievedChunks: ragResult.chunks,
      confidenceScore: ragResult.confidenceScore,
      isLowConfidence: false,
      directOfficialUrl: ragResult.directOfficialUrl,
      usedGemini,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Error processing inquiry',
      details: error?.message,
    });
  }
});

// 2. Services list
app.get('/api/services', (_req, res) => {
  res.json({
    services: OFFICIAL_SERVICES,
    total: OFFICIAL_SERVICES.length,
    portal: 'https://eservices.uk.gov.in',
  });
});

// 3. Service details
app.get('/api/services/:id', (req, res) => {
  const service = OFFICIAL_SERVICES.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ service });
});

// 4. Admin Knowledge Documents
app.get('/api/admin/documents', (_req, res) => {
  res.json({
    documents: governmentDocuments,
    totalChunks: governmentDocuments.reduce((acc, d) => acc + d.chunkCount, 0),
  });
});

app.post('/api/admin/documents', (req, res) => {
  try {
    const { title, department, category, content, sourceUrl, fileType } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const paragraphs = content.split('\n').filter((p: string) => p.trim().length > 0);
    const newDoc: GovernmentDocument = {
      id: `doc-${Date.now()}`,
      title,
      department: department || 'उत्तराखण्ड शासन',
      category: category || 'citizen',
      content,
      sourceUrl: sourceUrl || 'https://uk.gov.in',
      dateAdded: new Date().toISOString().split('T')[0],
      fileType: fileType || 'guideline',
      chunkCount: Math.max(1, paragraphs.length),
      verifiedOfficial: true,
    };

    governmentDocuments.unshift(newDoc);
    return res.status(201).json({ success: true, document: newDoc });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to add document', details: error?.message });
  }
});

app.delete('/api/admin/documents/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = governmentDocuments.length;
  governmentDocuments = governmentDocuments.filter(d => d.id !== id);
  if (governmentDocuments.length === initialLength) {
    return res.status(404).json({ error: 'Document not found' });
  }
  return res.json({ success: true, message: 'Document deleted from knowledge base' });
});

// 5. Statistics endpoint
app.get('/api/stats', (_req, res) => {
  res.json(usageStats);
});

// 6. Telephony Integration endpoints (Exotel / Twilio adapter compatible)
app.post('/api/telephony/incoming-call', (req, res) => {
  const { CallSid, From, To, digits } = req.body;
  usageStats.activeCallSessions++;

  // Standard TwiML / Exotel voice response
  const welcomeText = 'नमस्कार! उत्तराखण्ड सरकार की पहाड़ी सेवावाणी में आपका स्वागत है। आय, जाति या पेंशन प्रमाण पत्र हेतु 1 दबाएं अथवा अपनी बात बोलें।';

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech dtmf" timeout="5" numDigits="1" action="/api/telephony/process-speech" method="POST">
    <Say language="hi-IN" voice="Polly.Aditi">${welcomeText}</Say>
  </Gather>
  <Say language="hi-IN">हमें कोई उत्तर प्राप्त नहीं हुआ। कृपया पुनः प्रयास करें।</Say>
</Response>`;

  res.set('Content-Type', 'text/xml');
  res.send(twiml);
});

app.post('/api/telephony/process-speech', async (req, res) => {
  const speechResult = req.body.SpeechResult || req.body.RecordingUrl || req.body.query || 'आय प्रमाण पत्र के दस्तावेज';
  const digits = req.body.Digits;

  let query = speechResult;
  if (digits === '1') query = 'आय प्रमाण पत्र के आवश्यक दस्तावेज और प्रक्रिया';
  if (digits === '2') query = 'जाति प्रमाण पत्र';
  if (digits === '3') query = 'वृद्धावस्था पेंशन';
  if (digits === '4') query = 'नजदीकी सीएससी केंद्र';

  const ragResult = retrieveGovKnowledge(query, governmentDocuments, OFFICIAL_SERVICES);
  const speechAnswer = getDeterministicFallback(query, 'hi', ragResult.matchedService);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">${speechAnswer}</Say>
  <Gather input="dtmf" numDigits="1" action="/api/telephony/incoming-call">
    <Say language="hi-IN">मुख्य सूची के लिए शून्य (0) दबाएं अथवा कॉल समाप्त करें।</Say>
  </Gather>
</Response>`;

  res.set('Content-Type', 'text/xml');
  res.send(twiml);
});

// Phone Call Simulator endpoint for hackathon demo
app.post('/api/telephony/simulate', (req, res) => {
  const { spokenText, language = 'hi', digit } = req.body;
  let queryText = spokenText;
  if (digit === '1') queryText = 'आय प्रमाण पत्र';
  if (digit === '2') queryText = 'जाति प्रमाण पत्र';
  if (digit === '3') queryText = 'वृद्धावस्था पेंशन';
  if (digit === '4') queryText = 'नजदीकी सीएससी केंद्र';
  if (!queryText) queryText = 'आय प्रमाण पत्र दस्तावेज';

  const rag = retrieveGovKnowledge(queryText, governmentDocuments, OFFICIAL_SERVICES);
  const reply = getDeterministicFallback(queryText, language as SupportedLanguage, rag.matchedService);

  res.json({
    caller: '+91 94120 XXXXX (उत्तराखण्ड नागरिक)',
    ivrNumber: '1800-180-4100 (टोल-फ्री पहाड़ी सेवावाणी)',
    recognizedQuery: queryText,
    ivrSpeechReply: reply,
    matchedService: rag.matchedService,
    protocol: 'SIP / RTP / Webhook (TwiML & Exotel JSON)',
  });
});

// Mount Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pahadi SevaVaani] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
