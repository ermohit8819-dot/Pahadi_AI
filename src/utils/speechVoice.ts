/**
 * Indian Female Voice Synthesis Engine for Pahadi SevaVaani
 * Provides robust voice loading, Indian female voice prioritisation,
 * pitch/rate tuning, and fallbacks so speech works reliably across all browsers.
 */

export interface VoiceState {
  isSpeaking: boolean;
  voiceName: string;
  isReady: boolean;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let voiceInitPromise: Promise<SpeechSynthesisVoice[]> | null = null;

// Initialize and ensure voices are loaded
export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (voiceInitPromise) {
    return voiceInitPromise;
  }

  voiceInitPromise = new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    const onVoicesChanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(cachedVoices);
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Timeout fallback after 1.5s
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 1500);
  });

  return voiceInitPromise;
}

// Find the best Indian female voice
export function getIndianFemaleVoice(lang: string = 'hi'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Try Indian Hindi female voices (Google हिन्दी, Swara, Kalpana, Ananya)
  const hindiFemaleKeywords = ['swara', 'kalpana', 'ananya', 'geeta', 'female', 'woman', 'zira', 'lekha'];
  
  // High-priority Hindi voices
  const hindiVoices = voices.filter(v => v.lang.toLowerCase().startsWith('hi') || v.lang.includes('hi_IN') || v.lang.includes('hi-IN'));
  
  for (const voice of hindiVoices) {
    const nameLower = voice.name.toLowerCase();
    if (hindiFemaleKeywords.some(kw => nameLower.includes(kw))) {
      return voice;
    }
  }

  // Next: Any Hindi voice
  if (hindiVoices.length > 0) {
    return hindiVoices[0];
  }

  // 2. Try Indian English female voices (Heera, Neerja, Priya, Google Indian English)
  const indianEnglishVoices = voices.filter(v => 
    v.lang.toLowerCase().includes('en-in') || 
    v.lang.toLowerCase().includes('en_in') ||
    v.name.toLowerCase().includes('india')
  );

  const englishFemaleKeywords = ['heera', 'neerja', 'priya', 'veena', 'female', 'natural'];
  for (const voice of indianEnglishVoices) {
    const nameLower = voice.name.toLowerCase();
    if (englishFemaleKeywords.some(kw => nameLower.includes(kw))) {
      return voice;
    }
  }

  if (indianEnglishVoices.length > 0) {
    return indianEnglishVoices[0];
  }

  // 3. Fallback to any Indian voice or general female voice
  const anyIndian = voices.find(v => v.lang.toLowerCase().includes('in'));
  if (anyIndian) return anyIndian;

  return voices[0] || null;
}

// Clean text for natural speech synthesis
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/https?:\/\/[^\s]+/g, 'अपणि सरकार पोर्टल')
    .replace(/[#*`_\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 450); // limit to concise, point-to-point speech
}

// Speak using Indian female voice
export async function speakIndianFemale(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('SpeechSynthesis not supported');
    return;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Ensure voices are initialized
    await initVoices();

    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    // Small delay to let cancel settle in Chromium
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(clean);
        const selectedVoice = getIndianFemaleVoice('hi');

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || 'hi-IN';
        } else {
          utterance.lang = 'hi-IN';
        }

        // Female pitch tuning
        utterance.pitch = 1.15; // Natural clear female pitch
        utterance.rate = 0.95;  // Paced, courteous Indian cadence
        utterance.volume = 1.0;

        utterance.onstart = () => {
          onStart?.();
        };

        utterance.onend = () => {
          onEnd?.();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesisUtterance error:', e);
          onEnd?.();
        };

        // Resume if suspended
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech speak error:', err);
        onError?.(err);
      }
    }, 50);
  } catch (error) {
    console.error('Voice synthesis error:', error);
    onError?.(error);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
