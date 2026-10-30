import React, { useState } from 'react';
import { SupportedLanguage } from '../types/index.ts';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  Volume2, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Code2, 
  Play, 
  ArrowRight,
  ShieldCheck,
  Building,
  Key
} from 'lucide-react';

interface PhoneSimulatorProps {
  currentLang: SupportedLanguage;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ currentLang }) => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [keypadInput, setKeypadInput] = useState('');
  const [simulatedSpokenQuery, setSimulatedSpokenQuery] = useState('मुझे आय प्रमाण पत्र के बारे में जानना है');
  const [callTranscript, setCallTranscript] = useState<Array<{ sender: 'ivr' | 'caller'; text: string; time: string }>>([]);
  const [activeTab, setActiveTab] = useState<'simulator' | 'architecture' | 'twiml'>('simulator');
  const [isLoading, setIsLoading] = useState(false);

  // Timer simulation
  React.useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const handleStartCall = async () => {
    setCallState('calling');
    setCallTranscript([]);
    
    // Simulate connection delay
    setTimeout(() => {
      setCallState('connected');
      const initialGreeting = {
        sender: 'ivr' as const,
        text: 'नमस्कार! उत्तराखण्ड सरकार की पहाड़ी सेवावाणी टोल-फ्री हेल्पलाइन (1800-180-4100) में आपका स्वागत है। आय प्रमाण पत्र के लिए 1 दबाएं, जाति प्रमाण पत्र के लिए 2 दबाएं, पेंशन के लिए 3 दबाएं, अथवा अपनी बात बोलें।',
        time: '00:01',
      };
      setCallTranscript([initialGreeting]);

      // Play synthesized audio if browser allows
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance('नमस्कार! उत्तराखण्ड सरकार की पहाड़ी सेवावाणी में आपका स्वागत है। आय प्रमाण पत्र के लिए 1 दबाएं या बोलें।');
        u.lang = 'hi-IN';
        window.speechSynthesis.speak(u);
      }
    }, 1500);
  };

  const handleEndCall = () => {
    setCallState('ended');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTimeout(() => setCallState('idle'), 2000);
  };

  const handleSendQuery = async (queryText: string, digit?: string) => {
    if (callState !== 'connected' || isLoading) return;

    setIsLoading(true);
    const callerMsg = {
      sender: 'caller' as const,
      text: digit ? `[कीपैड पर ${digit} दबाया]: ${queryText}` : queryText,
      time: formatTime(callDuration),
    };
    setCallTranscript((prev) => [...prev, callerMsg]);

    try {
      const res = await fetch('/api/telephony/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: queryText,
          digit,
          language: currentLang,
        }),
      });
      const data = await res.json();

      const ivrMsg = {
        sender: 'ivr' as const,
        text: data.ivrSpeechReply,
        time: formatTime(callDuration + 2),
      };
      setCallTranscript((prev) => [...prev, ivrMsg]);

      // TTS simulation for phone ear
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(data.ivrSpeechReply.slice(0, 250));
        u.lang = 'hi-IN';
        window.speechSynthesis.speak(u);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypadPress = (num: string) => {
    setKeypadInput((prev) => prev + num);
    if (callState === 'connected') {
      let mapped = 'अन्य सेवा';
      if (num === '1') mapped = 'आय प्रमाण पत्र';
      if (num === '2') mapped = 'जाति प्रमाण पत्र';
      if (num === '3') mapped = 'वृद्धावस्था पेंशन';
      if (num === '4') mapped = 'नजदीकी सीएससी केंद्र';
      handleSendQuery(mapped, num);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-md border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>सामान्य फोन कॉल व आईवीआर एकीकरण (Telephony Integration Hub)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif">
              पहाड़ी सेवावाणी - टेलीफोन हेल्पलाइन (1800-180-4100)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              बिना इंटरनेट वाले साधारण कीपैड मोबाइल अथवा लैंडलाइन फोन से भी नागरिक अपनी बोली (हिन्दी, गढ़वाली, कुमाऊँनी) में कॉल करके सरकारी योजनाओं की जानकारी प्राप्त कर सकते हैं।
            </p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3.5 text-xs text-amber-200 max-w-xs shrink-0">
            <span className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              आधिकारिक सूचना (Production Telephony Ready)
            </span>
            <p className="text-[11px] leading-relaxed text-amber-100/90">
              यह प्रणाली Exotel / Twilio जैसे टेलीफोनी सेवा प्रदाताओं के लिए पूर्णतः तैयार है। सक्रिय नंबर और क्रेडेंशियल कॉन्फ़िगर होते ही वास्तविक फोन कॉल प्रारंभ हो जाएगी। नीचे दिए गए सिम्युलेटर से लाइव अनुभव का परीक्षण करें।
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="mt-6 flex gap-2 border-t border-blue-900/60 pt-4">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            📱 इंटरएक्टिव फोन सिम्युलेटर (Live Handset)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'architecture'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            🏗️ टेलीफोनी आर्किटेक्चर एवं फ्लो (Call Flow)
          </button>
          <button
            onClick={() => setActiveTab('twiml')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'twiml'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            📄 Exotel / Twilio Webhook Payload
          </button>
        </div>
      </div>

      {/* Simulator View */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Phone Handset Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[320px] bg-slate-900 text-white rounded-[40px] p-4 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between">
              {/* Top Notch / Speaker */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                </div>
              </div>

              {/* Handset Screen */}
              <div className="bg-slate-800 rounded-2xl p-4 text-center border border-slate-700 mb-4 min-h-[170px] flex flex-col items-center justify-center">
                {callState === 'idle' && (
                  <div>
                    <span className="text-slate-400 text-xs font-mono block">UK GOVT TOLL-FREE</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                      1800-180-4100
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">पहाड़ी सेवावाणी हेल्पलाइन</span>
                  </div>
                )}

                {callState === 'calling' && (
                  <div className="animate-pulse">
                    <span className="text-xs text-amber-400 font-bold block">कॉल कनेक्ट हो रही है...</span>
                    <span className="text-lg font-mono font-bold mt-1 block">1800-180-4100</span>
                    <span className="text-xs text-slate-400">Ringing...</span>
                  </div>
                )}

                {callState === 'connected' && (
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      कॉल जारी है (Live Call)
                    </div>
                    <span className="text-xl font-mono font-bold block text-white">
                      {formatTime(callDuration)}
                    </span>
                    <span className="text-xs text-slate-300 mt-1 block">
                      पहाड़ी सेवावाणी IVR सक्रिय
                    </span>
                    <div className="flex items-center justify-center gap-1 mt-2 text-emerald-400">
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span className="text-[10px] font-mono">Audio Active</span>
                    </div>
                  </div>
                )}

                {callState === 'ended' && (
                  <div>
                    <span className="text-xs text-rose-400 font-bold block">कॉल समाप्त (Call Ended)</span>
                    <span className="text-sm font-mono text-slate-400 mt-1 block">
                      अवधि: {formatTime(callDuration)}
                    </span>
                  </div>
                )}
              </div>

              {/* Dialpad Buttons */}
              <div className="grid grid-cols-3 gap-2 px-2 mb-4">
                {[
                  { num: '1', sub: 'आय' },
                  { num: '2', sub: 'जाति' },
                  { num: '3', sub: 'पेंशन' },
                  { num: '4', sub: 'CSC' },
                  { num: '5', sub: 'राशन' },
                  { num: '6', sub: 'किसान' },
                  { num: '7', sub: 'रोजगार' },
                  { num: '8', sub: 'जन्म' },
                  { num: '9', sub: 'मदद' },
                  { num: '*', sub: '' },
                  { num: '0', sub: 'Operator' },
                  { num: '#', sub: '' },
                ].map((k) => (
                  <button
                    key={k.num}
                    onClick={() => handleKeypadPress(k.num)}
                    className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl flex flex-col items-center justify-center border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-base leading-none text-white">{k.num}</span>
                    {k.sub && (
                      <span className="text-[9px] text-slate-400 leading-none mt-0.5">{k.sub}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Call / End Buttons */}
              <div className="flex items-center justify-around px-4 mb-2">
                {callState === 'idle' || callState === 'ended' ? (
                  <button
                    onClick={handleStartCall}
                    className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    title="Start Call"
                  >
                    <Phone className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    onClick={handleEndCall}
                    className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    title="End Call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
            </div>
          </div>

          {/* Call Controls & Live Audio Transcript */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    लाइव फोन कॉल मॉनिटर (Real-time Call Transcript)
                  </h3>
                  <p className="text-xs text-slate-500">
                    टेलीफोनी गेटवे (SIP/IVR) और सेवावाणी बैकएंड के बीच लाइव संवाद
                  </p>
                </div>
                <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
                  SIP Channel #1800
                </span>
              </div>

              {/* Transcript stream */}
              <div className="space-y-3 min-h-[260px] max-h-[340px] overflow-y-auto pr-1">
                {callTranscript.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                    <PhoneCall className="w-8 h-8 text-slate-300 mb-2" />
                    <p>कॉल प्रारंभ करने के लिए बाईं ओर के हैंडसेट पर हरे कॉल बटन को दबाएं।</p>
                  </div>
                ) : (
                  callTranscript.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                        t.sender === 'ivr'
                          ? 'bg-blue-50 border border-blue-200 text-blue-950 mr-8'
                          : 'bg-emerald-50 border border-emerald-200 text-emerald-950 ml-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>
                          {t.sender === 'ivr' ? '🤖 पहाड़ी सेवावाणी IVR' : '👤 नागरिक (Caller)'}
                        </span>
                        <span className="font-mono">{t.time}</span>
                      </div>
                      <p className="whitespace-pre-line">{t.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick voice simulation when call is connected */}
            {callState === 'connected' && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  नागरिक की ओर से बोलें (Simulate Speaking into Phone):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'मुझे आय प्रमाण पत्र के लिए कौन से दस्तावेज चाहिए?',
                    'जाति प्रमाण पत्र के क्या नियम हैं?',
                    'वृद्धावस्था पेंशन कितनी मिलती है?',
                    'मेरा नजदीकी सीएससी केंद्र कहाँ है?',
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendQuery(preset)}
                      disabled={isLoading}
                      className="text-xs bg-slate-100 hover:bg-blue-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Architecture View */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            उत्तराखण्ड टेलीफोनी एकीकरण प्रणाली (Telephony Integration Architecture)
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            पहाड़ी सेवावाणी साधारण टेलीफोन कॉल पर भी समान RAG व Gemini ज्ञान आधार से उत्तर प्रदान करती है।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center text-center my-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <Phone className="w-6 h-6 text-blue-900 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900">1. नागरिक कॉल</h4>
              <p className="text-[11px] text-slate-500 mt-1">1800-180-4100 पर कॉल डायल की जाती है</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 mx-auto hidden md:block" />

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <Server className="w-6 h-6 text-emerald-700 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900">2. Exotel / Twilio</h4>
              <p className="text-[11px] text-slate-500 mt-1">कॉल रिसीव कर आवाज को टेक्स्ट (STT) में बदलता है</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 mx-auto hidden md:block" />

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <Building className="w-6 h-6 text-blue-700 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900">3. सेवावाणी API</h4>
              <p className="text-[11px] text-slate-500 mt-1">FastAPI/Express RAG व Gemini से उत्तर तैयार करता है</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 mx-auto hidden md:block" />

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <Volume2 className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900">4. वॉयस प्लेबैक</h4>
              <p className="text-[11px] text-slate-500 mt-1">नागरिक को फोन स्पीकर पर प्राकृतिक उत्तर सुनाई देता है</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 mt-4 space-y-2">
            <span className="font-bold block text-sm">💡 प्रदाता सेटअप निर्देश (Provider Deployment Steps):</span>
            <p>
              1. <strong>Exotel / Twilio खाता</strong>: एक वर्चुअल फोन नंबर (DID) अथवा 1800 टोल-फ्री नंबर आवंटित कराएं।
            </p>
            <p>
              2. <strong>Webhook URL कॉन्फ़िगर करें</strong>: इनबाउंड कॉल URL को <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">https://your-domain.com/api/telephony/incoming-call</code> पर सेट करें।
            </p>
            <p>
              3. <strong>Speech Action URL</strong>: स्पीच परिणाम <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">/api/telephony/process-speech</code> पर अग्रेषित होते हैं।
            </p>
          </div>
        </div>
      )}

      {/* TwiML / NCCO Code View */}
      {activeTab === 'twiml' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            आधिकारिक टेलीफोनी Webhook प्रारूप (TwiML / NCCO Standard)
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            नीचे दिया गया TwiML रिस्पॉन्स हमारे बैकएंड द्वारा कॉल रिसीव होने पर भेजा जाता है:
          </p>

          <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`<?xml version="1.0" encoding="UTF-8"?>
<!-- Pahadi SevaVaani Inbound IVR Response -->
<Response>
  <Gather input="speech dtmf" timeout="5" numDigits="1" action="/api/telephony/process-speech" method="POST">
    <Say language="hi-IN" voice="Polly.Aditi">
      नमस्कार! उत्तराखण्ड सरकार की पहाड़ी सेवावाणी में आपका स्वागत है।
      आय, जाति या पेंशन प्रमाण पत्र हेतु 1 दबाएं अथवा बोलें।
    </Say>
  </Gather>
  <Say language="hi-IN">हमें कोई उत्तर प्राप्त नहीं हुआ। कृपया पुनः प्रयास करें।</Say>
</Response>`}
          </pre>
        </div>
      )}
    </div>
  );
};
