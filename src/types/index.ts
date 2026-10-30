export type SupportedLanguage = 'hi' | 'garhwali' | 'kumaoni' | 'en';

export interface ServiceItem {
  id: string;
  name: {
    hi: string;
    en: string;
    garhwali: string;
    kumaoni: string;
  };
  department: {
    hi: string;
    en: string;
  };
  category: 'certificate' | 'pension' | 'ration' | 'farmer' | 'employment' | 'citizen';
  summary: {
    hi: string;
    en: string;
    garhwali: string;
    kumaoni: string;
  };
  eligibility: string[];
  requiredDocuments: string[];
  officialFee: string;
  timelineDays: number;
  officialPortalUrl: string;
  offlineCenter: string;
  keywords: string[];
  verifiedOfficial: boolean;
  sampleQuestion: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  language: SupportedLanguage;
  timestamp: string;
  matchedService?: ServiceItem;
  sources?: Array<{
    title: string;
    url?: string;
    department?: string;
    isVerified: boolean;
  }>;
  audioGenerated?: boolean;
  isLowConfidence?: boolean;
  directOfficialUrl?: string;
}

export interface GovernmentDocument {
  id: string;
  title: string;
  department: string;
  category: string;
  content: string;
  sourceUrl?: string;
  dateAdded: string;
  fileType: 'pdf' | 'circular' | 'guideline' | 'faq';
  chunkCount: number;
  verifiedOfficial: boolean;
}

export interface UsageStats {
  totalQueries: number;
  voiceQueries: number;
  languagesUsed: Record<SupportedLanguage, number>;
  topServices: Array<{ serviceId: string; name: string; count: number }>;
  activeCallSessions: number;
}
