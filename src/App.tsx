import React, { useState } from 'react';
import { SupportedLanguage, ServiceItem } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { VoiceAssistant } from './components/VoiceAssistant.tsx';
import { ServicesDirectory } from './components/ServicesDirectory.tsx';
import { ApplicationTracker } from './components/ApplicationTracker.tsx';
import { PhoneSimulator } from './components/PhoneSimulator.tsx';
import { AdminKnowledgeBase } from './components/AdminKnowledgeBase.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { ShieldCheck, Mountain, Phone, Heart } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [activeTab, setActiveTab] = useState<'assistant' | 'services' | 'track' | 'phone' | 'admin' | 'about'>('assistant');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const handleAskAboutService = (sampleQuestion: string) => {
    setActiveTab('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAudioMuted={isAudioMuted}
        onToggleMute={() => setIsAudioMuted(!isAudioMuted)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'assistant' && (
          <VoiceAssistant
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            isAudioMuted={isAudioMuted}
            onOpenServiceDetails={(svc) => {
              setSelectedServiceModal(svc);
              setActiveTab('services');
            }}
            onOpenTracker={() => setActiveTab('track')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesDirectory
            currentLang={currentLang}
            onAskAboutService={handleAskAboutService}
            selectedServiceModal={selectedServiceModal}
            onCloseModal={() => setSelectedServiceModal(null)}
            onOpenModal={(svc) => setSelectedServiceModal(svc)}
          />
        )}

        {activeTab === 'track' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
            <ApplicationTracker />
          </div>
        )}

        {activeTab === 'phone' && (
          <PhoneSimulator currentLang={currentLang} />
        )}

        {activeTab === 'admin' && (
          <AdminKnowledgeBase />
        )}

        {activeTab === 'about' && (
          <AboutModal />
        )}
      </main>

      {/* Footer with Uttarakhand Govt branding */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-amber-300">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">
                पहाड़ी सेवावाणी (Pahadi SevaVaani)
              </p>
              <p className="text-[11px] text-slate-400">
                "अपनी भाषा, अपनी सरकार" • AI Voice Assistant for Uttarakhand Government Services
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs">
            <a
              href="https://eservices.uk.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              अपणि सरकार पोर्टल (eservices.uk.gov.in)
            </a>
            <span>•</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              हेल्पलाइन: 1800-180-4100
            </span>
            <span>•</span>
            <span className="text-slate-300">
              उत्तराखण्ड सेवा का अधिकार अधिनियम 2011
            </span>
          </div>

          <div className="text-[11px] text-slate-400 text-center md:text-right">
            <span>सूचना प्रौद्योगिकी विकास एजेंसी (ITDA), उत्तराखण्ड शासन</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
