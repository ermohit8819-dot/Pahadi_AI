import React from 'react';
import { Mountain, ShieldCheck, Heart, Sparkles, Phone, Bot, Database, CheckCircle2 } from 'lucide-react';

export const AboutModal: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-10 mb-8 shadow-xl border border-blue-900">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>उत्तराखण्ड शासन • सूचना प्रौद्योगिकी विकास एजेंसी (ITDA) पहल</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
          PAHADI SEVA VAANI (पहाड़ी सेवावाणी)
        </h2>
        <p className="text-lg font-semibold text-amber-300 mt-1">
          "Apni Bhasha, Apni Sarkar." (अपनी भाषा, अपनी सरकार)
        </p>
        <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-3xl leading-relaxed">
          उत्तराखण्ड के पर्वतीय और सुदूरवर्ती अंचलों के प्रत्येक नागरिक तक सरकारी सेवाओं की सुगम, पारदर्शी और सहज पहुंच सुनिश्चित करने हेतु विकसित क्षेत्रीय-भाषा एआई वॉयस असिस्टेंट।
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            1. भाषाई समावेशिता (Linguistic Inclusion)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            गढ़वाली, कुमाऊँनी और हिन्दी जैसी स्थानीय मातृभाषाओं में नागरिकों से संवाद। वरिष्ठ नागरिकों एवं अल्प-साक्षर ग्रामीणों के लिए बिना किसी जटिल फॉर्म के आवाज द्वारा त्वरित मार्गदर्शन।
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            2. सत्यापित अपणि सरकार RAG ज्ञान
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            कोई भी काल्पनिक या भ्रामक जानकारी नहीं। सभी उत्तर उत्तराखण्ड सेवा का अधिकार अधिनियम 2011, अधिकृत शासनादेशों और अपणि सरकार (eservices.uk.gov.in) पोर्टल के प्रामाणिक दस्तावेजों से ग्राउंडेड हैं।
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
            <Phone className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            3. स्मार्टफोन व साधारण कीपैड फोन एकीकरण
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            स्मार्टफोन पर वेब वॉयस इंटरफ़ेस के साथ-साथ साधारण कीपैड फोन हेतु Exotel व Twilio समर्थित 1800-180-4100 टोल-फ्री आईवीआर हेल्पलाइन। पहाड़ के अंतिम छोर के गांव तक सेवा।
          </p>
        </div>
      </div>

      {/* Technology Stack & Architecture Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-900" />
          <span>तकनीकी वास्तुकला (Technical Architecture)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">फ़्रंटएंड (Frontend)</span>
            <p className="text-slate-600">React 19 + TypeScript + Tailwind CSS (v4)</p>
            <p className="text-slate-600">Web Speech API (SpeechRecognition + SpeechSynthesis)</p>
            <p className="text-slate-600">Himalayan Blue & Forest Green Uttarakhand visual design</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">आर्टिफिशियल इंटेलिजेंस (AI & LLM)</span>
            <p className="text-slate-600">Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK)</p>
            <p className="text-slate-600">Grounded prompt generation with dynamic system instructions</p>
            <p className="text-slate-600">Strict Hallucination guardrails & official citation badges</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">ज्ञान पुनर्प्राप्ति (RAG & Vector Store)</span>
            <p className="text-slate-600">ChromaDB Compatible In-Memory Vector & BM25 Matcher</p>
            <p className="text-slate-600">Document chunking, ranking, and relevance scoring</p>
            <p className="text-slate-600">Official government notifications & FAQ indexes</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">टेलीफोनी गेटवे (Telephony Adapter)</span>
            <p className="text-slate-600">Exotel NCCO & Twilio TwiML Speech Webhook endpoints</p>
            <p className="text-slate-600">Full Python FastAPI source suite in `/backend` folder</p>
            <p className="text-slate-600">Interactive live in-browser phone handset simulator</p>
          </div>
        </div>
      </div>

      {/* Target Districts of Uttarakhand */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-xs text-slate-600">
        <span className="font-bold text-slate-900 text-sm block mb-2">
          उत्तराखण्ड के समस्त 13 जनपदों में सेवा विस्तार:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            'देहरादून (Dehradun)',
            'हरिद्वार (Haridwar)',
            'पौड़ी गढ़वाल (Pauri Garhwal)',
            'टिहरी गढ़वाल (Tehri Garhwal)',
            'उत्तरकाशी (Uttarkashi)',
            'चमोली (Chamoli)',
            'रुद्रप्रयाग (Rudraprayag)',
            'अल्मोड़ा (Almora)',
            'नैनीताल (Nainital)',
            'पिथौरागढ़ (Pithoragarh)',
            'बागेश्वर (Bageshwar)',
            'चम्पावत (Champawat)',
            'ऊधम सिंह नगर (Udham Singh Nagar)',
          ].map((dist, idx) => (
            <span
              key={idx}
              className="bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-md font-medium"
            >
              {dist}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
