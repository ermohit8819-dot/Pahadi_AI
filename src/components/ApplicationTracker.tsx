import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';

export const ApplicationTracker: React.FC = () => {
  const [appId, setAppId] = useState('UK/REV/2026/10482');
  const [trackedResult, setTrackedResult] = useState<any>({
    applicationId: 'UK/REV/2026/10482',
    serviceName: 'आय प्रमाण पत्र (Income Certificate)',
    applicantName: 'सुनील सिंह रावत (Sunil Singh Rawat)',
    district: 'पौड़ी गढ़वाल (Pauri Garhwal)',
    submissionDate: '24 अक्टूबर 2026',
    expectedDate: '08 नवम्बर 2026 (15 कार्य दिवस)',
    currentStatus: 'तहसीलदार कार्यालय में अंतिम स्वीकृति हेतु विचाराधीन (Tehsildar Review)',
    stage: 3, // 1: Submitted, 2: Patwari, 3: Tehsildar, 4: Ready
    officer: 'श्री वी. के. डंगवाल (तहसीलदार, कोटद्वार)',
  });

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) return;

    // Simulate lookup
    setTrackedResult({
      applicationId: appId.trim().toUpperCase(),
      serviceName: appId.includes('CAS') ? 'जाति प्रमाण पत्र' : 'आय प्रमाण पत्र (Income Certificate)',
      applicantName: 'नागरिक आवेदक (Citizen Applicant)',
      district: 'उत्तराखण्ड (Uttarakhand)',
      submissionDate: '26 अक्टूबर 2026',
      expectedDate: '10 नवम्बर 2026 (15 कार्य दिवस)',
      currentStatus: 'पटवारी सत्यापन आख्या प्रस्तुत, तहसीलदार स्वीकृति प्रक्रियाधीन',
      stage: 3,
      officer: 'तहसील राजस्व अधिकारी',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            अपणि सरकार • ऑनलाइन सेवा
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            🔍 आवेदन की स्थिति जांचें (Track Application Status)
          </h3>
          <p className="text-xs text-slate-500">
            अपने 16 अंकों के आवेदन क्रमांक से लाइव प्रगति देखें (Right to Service Act 2011)
          </p>
        </div>

        <a
          href="https://eservices.uk.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline shrink-0"
        >
          <span>आधिकारिक पोर्टल ट्रैकर</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="आवेदन क्रमांक दर्ज करें (उदा. UK/REV/2026/10482)..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase font-mono font-bold text-slate-800"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          स्थिति देखें
        </button>
      </form>

      {trackedResult && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs sm:text-sm space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">आवेदन क्रमांक:</span>
              <span className="font-bold font-mono text-slate-900">{trackedResult.applicationId}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">सेवा का नाम:</span>
              <span className="font-bold text-blue-900">{trackedResult.serviceName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">आवेदक:</span>
              <span className="font-bold text-slate-800">{trackedResult.applicantName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">नियत तिथि (Right to Service):</span>
              <span className="font-bold text-emerald-700">{trackedResult.expectedDate}</span>
            </div>
          </div>

          {/* Visual 4-Step Progress Bar for the common citizen */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-3">
              प्रमाण पत्र बनने के 4 चरण (Application Journey):
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ✓
                </div>
                <span className="font-bold text-emerald-800 mt-1">1. आवेदन जमा</span>
                <span className="text-[10px] text-slate-400">पोर्टल / सीएससी</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ✓
                </div>
                <span className="font-bold text-emerald-800 mt-1">2. पटवारी जांच</span>
                <span className="text-[10px] text-slate-400">आख्या सत्यापित</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs animate-pulse shadow-xs">
                  3
                </div>
                <span className="font-bold text-blue-900 mt-1">3. तहसीलदार स्वीकृति</span>
                <span className="text-[10px] text-blue-600 font-medium">प्रक्रियाधीन</span>
              </div>

              <div className="flex flex-col items-center opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <span className="font-bold text-slate-500 mt-1">4. प्रमाण पत्र तैयार</span>
                <span className="text-[10px] text-slate-400">डाउनलोड उपलब्ध</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              वर्तमान स्थिति: <strong className="text-blue-900">{trackedResult.currentStatus}</strong>
            </span>
            <a
              href="https://eservices.uk.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-white bg-blue-900 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>अपणि सरकार पोर्टल पर प्रमाण पत्र डाउनलोड करें</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
