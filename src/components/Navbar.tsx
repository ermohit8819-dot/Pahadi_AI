import React from 'react';
import { SupportedLanguage } from '../types/index.ts';
import { LANGUAGE_CONFIGS, UI_TRANSLATIONS } from '../utils/language.ts';
import { Mic, Volume2, VolumeX, ShieldCheck, Mountain, Phone, BookOpen, Layers, Info } from 'lucide-react';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeTab: 'assistant' | 'services' | 'track' | 'phone' | 'admin' | 'about';
  onTabChange: (tab: 'assistant' | 'services' | 'track' | 'phone' | 'admin' | 'about') => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  isAudioMuted,
  onToggleMute,
}) => {
  const t = UI_TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Govt Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-xs py-1.5 px-4 sm:px-8 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              उत्तराखण्ड शासन • अपणि सरकार एकीकृत नागरिक सेवा पहल (eservices.uk.gov.in)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              उत्तराखण्ड सेवा का अधिकार अधिनियम 2011
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-mono">हेल्पलाइन: 1800-180-4100</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onTabChange('assistant')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-emerald-800 p-0.5 shadow-md flex items-center justify-center text-white">
            <Mountain className="w-6 h-6 text-amber-300 drop-shadow-sm group-hover:scale-105 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
              <Mic className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                {t.appName}
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                AI Voice
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-800 tracking-wide">
              "{t.tagline}"
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onTabChange('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'assistant'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.assistantTab}</span>
          </button>

          <button
            onClick={() => onTabChange('services')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.servicesTab}</span>
          </button>

          <button
            onClick={() => onTabChange('track')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'track'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>स्थिति जांचें (Track)</span>
          </button>

          <button
            onClick={() => onTabChange('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'phone'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-blue-500" />
            <span className="flex items-center gap-1">
              {t.phoneTab}
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{t.adminTab}</span>
            <span className="sm:hidden">RAG</span>
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'about'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">{t.aboutTab}</span>
          </button>
        </nav>

        {/* Right Tools: Language Selector + Audio Toggle */}
        <div className="flex items-center gap-2">
          {/* Audio speech toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isAudioMuted ? 'Unmute voice playback' : 'Mute voice playback'}
            title={isAudioMuted ? 'आवाज म्यूट है (Unmute करें)' : 'आवाज चालू है (Mute करें)'}
            className={`p-2 rounded-lg border transition-all ${
              isAudioMuted
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Select Assistant Language"
              className="appearance-none bg-slate-50 border border-slate-300 hover:border-blue-700 text-slate-800 font-bold text-xs sm:text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors shadow-2xs cursor-pointer"
            >
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="garhwali">🏔️ गढ़वाली (Garhwali)</option>
              <option value="kumaoni">⛰️ कुमाऊँनी (Kumaoni)</option>
              <option value="en">🌐 English</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
