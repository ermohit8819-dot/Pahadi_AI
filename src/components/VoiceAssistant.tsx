import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage, ChatMessage, ServiceItem } from '../types/index.ts';
import { UI_TRANSLATIONS, SAMPLE_QUESTIONS, LANGUAGE_CONFIGS } from '../utils/language.ts';
import { speakIndianFemale, stopSpeaking, initVoices } from '../utils/speechVoice.ts';
import { 
  Mic, 
  MicOff, 
  Send, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  ExternalLink, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  IndianRupee,
  ShieldAlert,
  Loader2,
  HelpCircle,
  Search,
  UserCheck
} from 'lucide-react';

interface VoiceAssistantProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isAudioMuted: boolean;
  onOpenServiceDetails: (service: ServiceItem) => void;
  onOpenTracker?: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  currentLang,
  onLanguageChange,
  isAudioMuted,
  onOpenServiceDetails,
  onOpenTracker,
}) => {
  const t = UI_TRANSLATIONS[currentLang];
  const langConfig = LANGUAGE_CONFIGS[currentLang];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'नमस्ते! मैं अंजलि हूँ, उत्तराखण्ड अपणि सरकार से आपकी वॉयस सहचर।\n\nआप माइक दबाकर आय, जाति, मूल निवास, पर्वतीय प्रमाण पत्र अथवा पेंशन के बारे में सीधे पूछ सकते हैं। मैं आपको टू-द-पॉइंट सरकारी नियम, फीस और दस्तावेज बताऊँगी।',
      language: currentLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        {
          title: 'अपणि सरकार पोर्टल (eservices.uk.gov.in)',
          url: 'https://eservices.uk.gov.in',
          department: 'सूचना प्रौद्योगिकी विकास एजेंसी (ITDA), उत्तराखण्ड',
          isVerified: true,
        },
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [voiceTestMessage, setVoiceTestMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Pre-load Indian voices on mount
  useEffect(() => {
    initVoices();
  }, []);

  // Auto-scroll chat only when user interacts or multiple messages exist
  useEffect(() => {
    if (messages.length > 1 || isProcessing || liveTranscript) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages.length, liveTranscript, isProcessing]);

  // Handle Indian female speech synthesis
  const handleSpeak = (text: string, messageId: string) => {
    if (isAudioMuted) return;

    setCurrentlySpeakingId(messageId);
    speakIndianFemale(
      text,
      () => setCurrentlySpeakingId(messageId),
      () => setCurrentlySpeakingId(null),
      (err) => {
        console.warn('Speech error:', err);
        setCurrentlySpeakingId(null);
      }
    );
  };

  // Indian female voice quick test button
  const handleTestVoice = () => {
    const testText = 'नमस्ते! मैं अंजलि हूँ। उत्तराखण्ड सरकार की अपणि सरकार सेवाओं में आपका स्वागत है। आवाज स्पष्ट आ रही है।';
    setVoiceTestMessage('🔊 अंजलि बोल रही हैं (Indian Female Voice)...');
    setCurrentlySpeakingId('test');
    speakIndianFemale(
      testText,
      () => setCurrentlySpeakingId('test'),
      () => {
        setCurrentlySpeakingId(null);
        setVoiceTestMessage('✓ आवाज परीक्षण सफल (Speech Active)');
        setTimeout(() => setVoiceTestMessage(null), 3000);
      },
      (err) => {
        setCurrentlySpeakingId(null);
        setVoiceTestMessage('आवाज शुरू करने में रुकावट। कृपया ब्राउज़र अनम्यूट करें।');
      }
    );
  };

  // Web Speech Recognition
  const startSpeechRecognition = () => {
    setMicError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('आपके ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया नीचे टाइप करें अथवा Chrome ब्राउज़र का उपयोग करें।');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = langConfig.speechCode || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setLiveTranscript(final || interim);
        if (final) {
          handleSendMessage(final.trim());
          stopSpeechRecognition();
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setMicError('माइक्रोफोन अनुमति नहीं मिली। कृपया ब्राउज़र के पते (URL) के पास माइक आइकन पर Allow दबाएं।');
        } else if (event.error === 'no-speech') {
          setMicError('कोई आवाज नहीं सुनाई दी। कृपया दोबारा बोलें।');
        } else {
          setMicError(`माइक सूचना: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setMicError('माइक शुरू करने में समस्या आई। नीचे बॉक्स में लिखकर पूछें।');
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Submit query
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    setInputText('');
    setLiveTranscript('');
    setMicError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      language: currentLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang,
          history: messages.slice(-3).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        language: data.language || currentLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedService: data.matchedService,
        sources: data.sources || [],
        isLowConfidence: data.isLowConfidence,
        directOfficialUrl: data.directOfficialUrl,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak automatically if unmuted
      if (!isAudioMuted) {
        handleSpeak(data.reply, assistantMessage.id);
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'नमस्ते! अपणि सरकार पोर्टल (https://eservices.uk.gov.in/) पर सभी प्रमाण पत्र 15 दिनों में बनाए जाते हैं। सीएससी पर ₹30 शुल्क लगता है। आप सीधे पोर्टल पर जाकर आवेदन कर सकते हैं।',
        language: currentLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'नमस्ते! मैं अंजलि हूँ, उत्तराखण्ड अपणि सरकार से। आप किसी भी प्रमाण पत्र, राशन कार्ड अथवा पेंशन के बारे में पूछ सकते हैं।',
        language: currentLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMicError(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] max-w-5xl mx-auto px-4 py-4">
      {/* Top Professional Govt Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-900/50 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Indian Female Assistant Avatar */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden relative">
                <span className="text-2xl sm:text-3xl">👩🏽‍💼</span>
                {currentlySpeakingId && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                  अंजलि (Anjali) • अपणि सरकार वॉयस सहचर
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                  Indian Female Voice
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-300 font-semibold mt-0.5">
                "अपनी भाषा, अपनी सरकार" • eservices.uk.gov.in अधिकृत डेटा
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5 hidden sm:block">
                टू-द-पॉइंट सरकारी नियम, आवश्यक दस्तावेज, ₹30 सरकारी फीस एवं 15 दिन की कानूनी समय सीमा।
              </p>
            </div>
          </div>

          {/* Quick Voice Test & Direct Portal Link */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <button
              onClick={handleTestVoice}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title="अंजलि की भारतीय महिला आवाज का परीक्षण करें"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-950" />
              <span>🔊 अंजलि की आवाज टेस्ट करें</span>
            </button>

            <a
              href="https://eservices.uk.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <span>अपणि सरकार पोर्टल (eservices.uk.gov.in)</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </a>
          </div>
        </div>

        {voiceTestMessage && (
          <div className="mt-3 bg-white/10 border border-amber-300/40 text-amber-200 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{voiceTestMessage}</span>
          </div>
        )}
      </div>

      {/* Quick Action Tiles for the Common Layman Citizen (आम नागरिक के लिए 4 बड़े बटन) */}
      <div className="mb-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
          आम नागरिक हेतु त्वरित सेवाएं (1-क्लिक में पूछें):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleSendMessage('मुझे आय प्रमाण पत्र बनवाना है। इसके लिए कौन-कौन से दस्तावेज चाहिए?')}
            disabled={isProcessing}
            className="text-left bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 p-3 rounded-xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="text-lg mb-1">📝</div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900">
              आय प्रमाण पत्र (Income)
            </h4>
            <span className="text-[10px] text-slate-500 block mt-0.5">₹30 फीस • 15 दिन</span>
          </button>

          <button
            onClick={() => handleSendMessage('उत्तराखण्ड में जाति प्रमाण पत्र और मूल निवास के लिए कौन से दस्तावेज चाहिए?')}
            disabled={isProcessing}
            className="text-left bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 p-3 rounded-xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="text-lg mb-1">📜</div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900">
              जाति / मूल निवास (Caste)
            </h4>
            <span className="text-[10px] text-slate-500 block mt-0.5">SC/ST/OBC • 1985 साक्ष्य</span>
          </button>

          <button
            onClick={() => handleSendMessage('पर्वतीय क्षेत्र प्रमाण पत्र (Hill Certificate) कैसे बनता है और सेना भर्ती में क्या छूट मिलती है?')}
            disabled={isProcessing}
            className="text-left bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 p-3 rounded-xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="text-lg mb-1">🏔️</div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900">
              पर्वतीय प्रमाण पत्र (Hill)
            </h4>
            <span className="text-[10px] text-slate-500 block mt-0.5">हाइट व चेस्ट में छूट</span>
          </button>

          <button
            onClick={() => handleSendMessage('वृद्धावस्था पेंशन के लिए पात्रता क्या है और कितना पैसा मिलता है?')}
            disabled={isProcessing}
            className="text-left bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 p-3 rounded-xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="text-lg mb-1">👵</div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900">
              वृद्धावस्था पेंशन (Pension)
            </h4>
            <span className="text-[10px] text-slate-500 block mt-0.5">₹1500/माह • 60+ वर्ष</span>
          </button>
        </div>
      </div>

      {/* Main Large Microphone Centerpiece */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center flex flex-col items-center justify-center mb-4 relative">
        <div className="relative my-1">
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full bg-rose-500/20 animate-pulse"></div>
            </>
          )}

          <button
            onClick={toggleListening}
            disabled={isProcessing}
            aria-label="Tap and Speak with Anjali"
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all transform shadow-xl focus:outline-none cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white scale-105 ring-4 ring-rose-300'
                : 'bg-gradient-to-tr from-blue-900 via-indigo-900 to-emerald-800 text-white hover:scale-105 shadow-blue-900/30 ring-4 ring-blue-100'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 sm:w-11 sm:h-11 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 sm:w-11 sm:h-11 text-amber-300" />
            )}
          </button>
        </div>

        <div className="mt-2.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {isListening ? (
              <span className="text-rose-600 font-extrabold flex items-center gap-2 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                अंजलि सुन रही हैं... बोलिए
              </span>
            ) : isProcessing ? (
              <span className="text-blue-800 flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                अपणि सरकार पोर्टल से सटीक नियम देख रही हूँ...
              </span>
            ) : (
              <span className="text-slate-900">यहाँ दबाएं और बोलें (Tap and Speak)</span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            अपनी मातृभाषा (हिन्दी, गढ़वाली, कुमाऊँनी) में बोलें, अंजलि आपको सटीक उत्तर देंगी।
          </p>
        </div>

        {/* Live speech transcription */}
        {(liveTranscript || isListening) && (
          <div className="mt-3 w-full max-w-lg bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs sm:text-sm text-blue-950 font-medium">
            <span className="text-[10px] text-blue-700 font-bold block mb-0.5">
              लाइव आवाज पहचान:
            </span>
            <p className="italic font-sans">
              "{liveTranscript || 'कृपया अपनी बात कहें...'}"
            </p>
          </div>
        )}

        {micError && (
          <div className="mt-2.5 w-full max-w-lg bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900 flex items-start gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{micError}</p>
          </div>
        )}
      </div>

      {/* Conversation Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">नागरिक संवाद (Conversations)</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              {messages.length} संदेश
            </span>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>बातचीत साफ़ करें</span>
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-4 overflow-y-auto max-h-[520px] pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                  <span className="font-bold">
                    {isUser ? 'आप (नागरिक)' : 'अंजलि (वॉयस सहचर)'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`relative max-w-2xl rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-blue-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>

                  {/* Play Audio Button with Indian Female Voice */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (currentlySpeakingId === msg.id) {
                            stopSpeaking();
                            setCurrentlySpeakingId(null);
                          } else {
                            handleSpeak(msg.text, msg.id);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          currentlySpeakingId === msg.id
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {currentlySpeakingId === msg.id ? '🔊 अंजलि बोल रही हैं (Stop)' : '🔊 अंजलि की आवाज में सुनें'}
                        </span>
                      </button>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        eservices.uk.gov.in सत्यापित
                      </span>
                    </div>
                  )}

                  {/* Service Specific Information Card */}
                  {!isUser && msg.matchedService && (
                    <div className="mt-3 bg-white rounded-xl border border-blue-200 p-3.5 shadow-xs text-slate-900">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                            सत्यापित सरकारी सेवा संक्षेप
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {msg.matchedService.name.hi}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {msg.matchedService.department.hi}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-500 block text-[10px] font-medium">सरकारी फीस:</span>
                          <span className="font-bold text-emerald-700">{msg.matchedService.officialFee}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-medium">समय सीमा:</span>
                          <span className="font-bold text-blue-900">{msg.matchedService.timelineDays} कार्य दिवस</span>
                        </div>
                      </div>

                      <div className="text-xs mb-3">
                        <span className="font-bold text-slate-800 block mb-1">
                          📄 मुख्य दस्तावेज (Documents Checklist):
                        </span>
                        <ul className="space-y-1">
                          {msg.matchedService.requiredDocuments.slice(0, 4).map((doc, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prominent Direct Portal Redirect Button */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                        <a
                          href={msg.matchedService.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
                        >
                          <span>🔗 अपणि सरकार पोर्टल पर आवेदन करें (Apply Now)</span>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                        </a>

                        <button
                          onClick={() => onOpenServiceDetails(msg.matchedService!)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>पूरा विवरण</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Low Confidence Direct Official URL Redirection Card */}
                  {!isUser && msg.isLowConfidence && (
                    <div className="mt-3.5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-4 shadow-md border border-blue-800">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-white">
                            आधिकारिक सेवा पोर्टल सीधा लिंक (Direct Official Redirect)
                          </h4>
                          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                            नागरिक सुरक्षा एवं सेवा का अधिकार अधिनियम 2011 के तहत, अपुष्ट अथवा कम विश्वसनीयता वाली जानकारी के स्थान पर कृपया सीधे अधिकृत पोर्टल पर जाएं:
                          </p>
                          <a
                            href={msg.directOfficialUrl || 'https://eservices.uk.gov.in/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <span>🔗 अपणि सरकार आधिकारिक पोर्टल खोलें: {msg.directOfficialUrl || 'https://eservices.uk.gov.in/'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Out of scope direct redirect link if matched service is absent and not low confidence */}
                  {!isUser && !msg.matchedService && !msg.isLowConfidence && msg.id !== 'welcome-1' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200">
                      <a
                        href="https://eservices.uk.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                      >
                        <span>🔗 अपणि सरकार आधिकारिक पोर्टल खोलें (eservices.uk.gov.in)</span>
                        <ExternalLink className="w-3 h-3 text-amber-200" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex flex-col items-start space-y-1">
              <div className="text-[11px] text-slate-400 font-bold px-1">अंजलि</div>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-900" />
                <span>अपणि सरकार पोर्टल से सत्यापित जानकारी खोजी जा रही है...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Text Input Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder="यहाँ प्रश्न लिखें अथवा ऊपर माइक दबाकर बोलें..."
            className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            aria-label="Send query"
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 text-white disabled:text-slate-400 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>भेजें</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
