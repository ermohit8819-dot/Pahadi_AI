import { ServiceItem, GovernmentDocument, SupportedLanguage } from '../types/index.ts';
import { OFFICIAL_SERVICES, INITIAL_GOVERNMENT_DOCUMENTS } from '../data/servicesData.ts';

export const OFFICIAL_PORTAL_URL = 'https://eservices.uk.gov.in/';
export const CONFIDENCE_THRESHOLD = 0.65;

export interface RetrievedChunk {
  id: string;
  sourceTitle: string;
  sourceDepartment: string;
  sourceUrl?: string;
  text: string;
  score: number;
  isVerified: boolean;
  serviceId?: string;
  isOfficialEservicesSnippet: boolean;
}

export interface RagSearchResult {
  query: string;
  matchedService?: ServiceItem;
  chunks: RetrievedChunk[];
  sources: Array<{
    title: string;
    url?: string;
    department?: string;
    isVerified: boolean;
  }>;
  confidenceScore: number;
  isLowConfidence: boolean;
  directOfficialUrl: string;
  suggestedActionText: string;
}

// Tokenize text for semantic word matching
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[।.,?!;:'"()\[\]{}\/\\-]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 1);
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'to', 'for', 'of', 'in', 'on', 'at', 'or', 'and', 'by', 'with', 'it', 'as', 'be',
  'how', 'what', 'where', 'when', 'who', 'which', 'why', 'can', 'do', 'does', 'did', 'my', 'me', 'your', 'you',
  'का', 'की', 'के', 'है', 'हैं', 'को', 'में', 'पर', 'से', 'और', 'या', 'था', 'थी', 'हो', 'ने', 'तो', 'ही', 'कर', 'करें', 'लिए', 'सकते', 'सकता', 'सकती'
]);

// Compute relevance with heavy weight for exact query-keyword match and eservices.uk.gov.in snippets
export function computeScore(
  queryTokens: string[], 
  docText: string, 
  boostKeywords: string[] = [],
  isEservicesOrigin: boolean = false
): number {
  if (!queryTokens.length || !docText) return 0;
  const docTokens = tokenize(docText);
  const docTokenSet = new Set(docTokens);
  const queryText = queryTokens.join(' ').toLowerCase();

  let score = 0;
  let matchedMeaningfulTokens = 0;
  let matchedKeyword = false;

  // Exact phrase match bonus
  if (docText.toLowerCase().includes(queryText) && queryText.length > 5) {
    score += 5.0;
    matchedMeaningfulTokens++;
  }

  for (const token of queryTokens) {
    if (STOP_WORDS.has(token)) continue;
    if (docTokenSet.has(token)) {
      score += 2.0;
      matchedMeaningfulTokens++;
    } else if (token.length >= 3 && docText.toLowerCase().includes(token)) {
      score += 1.0;
      matchedMeaningfulTokens++;
    }
  }

  // Heavy bonus when user query matches official service keywords
  for (const kw of boostKeywords) {
    const kwLower = kw.toLowerCase();
    if (queryText.includes(kwLower) || queryTokens.includes(kwLower)) {
      score += 6.0;
      matchedKeyword = true;
    }
  }

  // Prioritize exact snippets from the 'eservices.uk.gov.in' portal only when topical match exists
  if (isEservicesOrigin && (matchedMeaningfulTokens > 0 || matchedKeyword)) {
    score += 3.5;
  }

  return score;
}

// Match query to the closest official service
export function matchService(query: string, services: ServiceItem[] = OFFICIAL_SERVICES): ServiceItem | undefined {
  const queryTokens = tokenize(query);
  let bestService: ServiceItem | undefined;
  let bestScore = 0;

  for (const service of services) {
    const searchableText = [
      service.name.hi,
      service.name.en,
      service.name.garhwali,
      service.name.kumaoni,
      service.department.hi,
      service.summary.hi,
      service.summary.en,
      service.offlineCenter,
      ...service.requiredDocuments,
      ...service.eligibility,
    ].join(' ');

    const score = computeScore(queryTokens, searchableText, service.keywords, true);
    if (score > bestScore && score >= 4.0) {
      bestScore = score;
      bestService = service;
    }
  }

  return bestService;
}

// Perform RAG retrieval over verified government documents prioritizing eservices.uk.gov.in snippets
export function retrieveGovKnowledge(
  query: string,
  documents: GovernmentDocument[] = INITIAL_GOVERNMENT_DOCUMENTS,
  services: ServiceItem[] = OFFICIAL_SERVICES,
  topK: number = 3
): RagSearchResult {
  const queryTokens = tokenize(query);
  const chunks: RetrievedChunk[] = [];
  const matchedService = matchService(query, services);

  // 1. Chunks from matched service (Directly grounded in eservices.uk.gov.in catalog)
  if (matchedService) {
    chunks.push({
      id: `svc-${matchedService.id}-core`,
      sourceTitle: `${matchedService.name.hi} (${matchedService.department.hi})`,
      sourceDepartment: matchedService.department.hi,
      sourceUrl: matchedService.officialPortalUrl,
      text: `सेवा: ${matchedService.name.hi}
विभाग: ${matchedService.department.hi}
आवश्यक दस्तावेज: ${matchedService.requiredDocuments.join(', ')}
सरकारी शुल्क: ${matchedService.officialFee}
समय सीमा: ${matchedService.timelineDays} दिन (उत्तराखण्ड सेवा का अधिकार अधिनियम 2011)
आधिकारिक पोर्टल: ${matchedService.officialPortalUrl}`,
      score: 12.0,
      isVerified: matchedService.verifiedOfficial,
      serviceId: matchedService.id,
      isOfficialEservicesSnippet: true,
    });
  }

  // 2. Chunks from indexed government documents (Prioritize eservices.uk.gov.in origins)
  for (const doc of documents) {
    const isEservices = doc.sourceUrl?.includes('eservices.uk.gov.in') || doc.content.includes('eservices.uk.gov.in');
    const paragraphs = doc.content.split('\n').filter(p => p.trim().length > 10);
    
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const score = computeScore(queryTokens, p, [doc.title, doc.category, doc.department], isEservices);
      if (score > 1.5) {
        chunks.push({
          id: `${doc.id}-chunk-${i}`,
          sourceTitle: doc.title,
          sourceDepartment: doc.department,
          sourceUrl: doc.sourceUrl,
          text: p.trim(),
          score,
          isVerified: doc.verifiedOfficial,
          isOfficialEservicesSnippet: isEservices,
        });
      }
    }
  }

  // Sort descending by relevance score
  chunks.sort((a, b) => b.score - a.score);
  const selectedChunks = chunks.slice(0, topK);

  const topScore = selectedChunks.length > 0 ? selectedChunks[0].score : 0;

  // Calculate normalized confidence score
  let confidenceScore = 0.0;
  if (matchedService) {
    confidenceScore = Math.min(1.0, 0.70 + (topScore / 40.0));
  } else if (selectedChunks.length > 0) {
    confidenceScore = Math.min(0.64, topScore / 15.0);
  }

  // Strict confidence check: Low confidence threshold
  const isLowConfidence = confidenceScore < CONFIDENCE_THRESHOLD;

  // Extract verified sources
  const seenSources = new Set<string>();
  const sources: Array<{ title: string; url?: string; department?: string; isVerified: boolean }> = [];

  for (const c of selectedChunks) {
    if (!seenSources.has(c.sourceTitle)) {
      seenSources.add(c.sourceTitle);
      sources.push({
        title: c.sourceTitle,
        url: c.sourceUrl || OFFICIAL_PORTAL_URL,
        department: c.sourceDepartment,
        isVerified: c.isVerified,
      });
    }
  }

  const directOfficialUrl = matchedService?.officialPortalUrl || OFFICIAL_PORTAL_URL;
  const suggestedActionText = matchedService 
    ? `${matchedService.name.hi} - अपणि सरकार पर आवेदन करें`
    : 'अपणि सरकार आधिकारिक सेवा पोर्टल (eservices.uk.gov.in)';

  return {
    query,
    matchedService,
    chunks: selectedChunks,
    sources,
    confidenceScore,
    isLowConfidence,
    directOfficialUrl,
    suggestedActionText,
  };
}

// Build grounded prompt for Gemini
export function buildGroundedPrompt(
  query: string,
  language: SupportedLanguage,
  retrieved: RagSearchResult,
  history: Array<{ sender: string; text: string }> = []
): { systemInstruction: string; userPrompt: string } {
  const systemInstruction = `आप उत्तराखण्ड सरकार के अपणि सरकार (Apuni Sarkar - eservices.uk.gov.in) पोर्टल की आधिकारिक एआई वॉयस असिस्टेंट 'अंजलि' (Pahadi SevaVaani / पहाड़ी सेवावाणी) हैं।
आपकी आवाज एक विनम्र, स्पष्ट, आत्मीय भारतीय महिला प्रतिनिधि (Indian Female Representative) की है।

मुख्य नियम (STRICT PUBLISHING INSTRUCTIONS):
1. केवल 'eservices.uk.gov.in' के आधिकारिक स्निपेट्स और नियमों के आधार पर सटीक, संक्षिप्त (To-the-point) उत्तर दें।
2. जब भी कोई प्रमाण पत्र या सेवा पूछी जाए, हमेशा ये 4 बिंदु स्पष्ट बताएं:
   - ⏱️ समय सीमा: (जैसे 15 कार्य दिवस - सेवा का अधिकार कानून 2011)
   - 💰 सरकारी शुल्क: (जैसे ₹30 सीएससी केंद्र पर, ₹0 अपणि सरकार पोर्टल पर)
   - 📄 आवश्यक दस्तावेज: (केवल 3-4 मुख्य दस्तावेज)
   - 🔗 आधिकारिक आवेदन लिंक: https://eservices.uk.gov.in/
3. यदि प्रश्न का सत्यापन स्कोर कम हो (Low Confidence) या सेवा रिकॉर्ड में न मिले:
   - कोई भी अधूरा, अस्पष्ट या अनुमानित उत्तर देने का प्रयास न करें।
   - सीधे नागरिक को आधिकारिक सेवा लिंक प्रदान करें: "आधिकारिक अपणि सरकार पोर्टल पर इस प्रश्न का सत्यापित रिकॉर्ड नहीं मिला। कृपया सीधे आधिकारिक सेवा पोर्टल https://eservices.uk.gov.in/ पर जाएं।"
4. किसी भी स्थिति में मनगढ़ंत नियम या असत्यापित जानकारी न दें।`;

  const contextText = retrieved.chunks
    .map(c => `[स्रोत: ${c.sourceTitle} | URL: ${c.sourceUrl || OFFICIAL_PORTAL_URL}]\n${c.text}`)
    .join('\n\n');

  const conversationContext = history
    .slice(-3)
    .map(h => `${h.sender === 'user' ? 'नागरिक' : 'अंजलि'}: ${h.text}`)
    .join('\n');

  const userPrompt = `आधिकारिक ज्ञान आधार (eservices.uk.gov.in Official Records):
${contextText || 'अपणि सरकार पोर्टल (https://eservices.uk.gov.in/)'}

${conversationContext ? `पिछला संवाद:\n${conversationContext}\n` : ''}
नागरिक का प्रश्न: "${query}"
विश्वास स्तर (Confidence Score): ${retrieved.confidenceScore.toFixed(2)} (${retrieved.isLowConfidence ? 'LOW' : 'HIGH'})
भाषा: ${language}`;

  return { systemInstruction, userPrompt };
}
