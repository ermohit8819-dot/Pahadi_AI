import React, { useState } from 'react';
import { ServiceItem, SupportedLanguage } from '../types/index.ts';
import { OFFICIAL_SERVICES } from '../data/servicesData.ts';
import { UI_TRANSLATIONS } from '../utils/language.ts';
import { 
  Search, 
  Filter, 
  FileCheck2, 
  ExternalLink, 
  Clock, 
  IndianRupee, 
  Building2, 
  CheckCircle2, 
  Mic, 
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface ServicesDirectoryProps {
  currentLang: SupportedLanguage;
  onAskAboutService: (serviceName: string) => void;
  selectedServiceModal: ServiceItem | null;
  onCloseModal: () => void;
  onOpenModal: (service: ServiceItem) => void;
}

export const ServicesDirectory: React.FC<ServicesDirectoryProps> = ({
  currentLang,
  onAskAboutService,
  selectedServiceModal,
  onCloseModal,
  onOpenModal,
}) => {
  const t = UI_TRANSLATIONS[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'सभी सेवाएं (All Services)' },
    { id: 'certificate', label: 'प्रमाण पत्र (Certificates)' },
    { id: 'pension', label: 'पेंशन योजनाएं (Pensions)' },
    { id: 'ration', label: 'राशन कार्ड (Food & Supplies)' },
    { id: 'farmer', label: 'कृषक कल्याण (Farmer Schemes)' },
    { id: 'employment', label: 'रोजगार (Employment)' },
    { id: 'citizen', label: 'नागरिक सेवा केंद्र (CSC & Centers)' },
  ];

  const filteredServices = OFFICIAL_SERVICES.filter((svc) => {
    const matchesCategory = activeCategory === 'all' || svc.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery =
      svc.name.hi.toLowerCase().includes(query) ||
      svc.name.en.toLowerCase().includes(query) ||
      svc.name.garhwali.toLowerCase().includes(query) ||
      svc.name.kumaoni.toLowerCase().includes(query) ||
      svc.department.hi.toLowerCase().includes(query) ||
      svc.keywords.some(k => k.toLowerCase().includes(query)) ||
      svc.requiredDocuments.some(d => d.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Directory Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-md border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>अपणि सरकार • आधिकारिक नागरिक सेवा संदर्शिका</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif">
              उत्तराखण्ड नागरिक सेवाएं संदर्शिका (Services Directory)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              उत्तराखण्ड सेवा का अधिकार अधिनियम 2011 के तहत अधिसूचित सभी जन-कल्याणकारी सेवाएं, आवश्यक दस्तावेज, सरकारी शुल्क व आवेदन लिंक।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-xs text-white shrink-0">
            <span className="text-amber-300 font-bold block text-sm">कुल अधिसूचित सेवाएं: 250+</span>
            <span className="text-slate-300">अपणि सरकार पोर्टल पर उपलब्ध</span>
            <a
              href="https://eservices.uk.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>अपणि सरकार पोर्टल खोलें</span>
              <ExternalLink className="w-3 h-3 text-amber-200" />
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="प्रमाण पत्र का नाम, योजना या आवश्यक दस्तावेज खोजें (उदा. आय प्रमाण पत्र, खतौनी, आधार)..."
              className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                  {svc.category.toUpperCase()}
                </span>

                <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {svc.timelineDays} दिन
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                {svc.name[currentLang] || svc.name.hi}
              </h3>

              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1 mb-2">
                <Building2 className="w-3 h-3 text-slate-400" />
                {svc.department.hi}
              </p>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {svc.summary[currentLang] || svc.summary.hi}
              </p>

              {/* Quick Specs */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-600 font-medium">सरकारी शुल्क:</span>
                  <span className="font-bold text-slate-900">{svc.officialFee}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-600 font-medium">आवेदन स्थल:</span>
                  <span className="font-medium truncate max-w-[170px]" title={svc.offlineCenter}>
                    {svc.offlineCenter}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onAskAboutService(svc.sampleQuestion)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 transition-colors"
                title="वॉयस असिस्टेंट से इस सेवा के बारे में पूछें"
              >
                <Mic className="w-3.5 h-3.5 text-rose-600" />
                <span>बोलकर पूछें</span>
              </button>

              <button
                onClick={() => onOpenModal(svc)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all shadow-2xs"
              >
                <span>दस्तावेज सूची</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <p className="text-slate-500 text-sm">कोई सेवा नहीं मिली। कृपया अन्य कीवर्ड खोजें।</p>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  अपणि सरकार सेवा
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedServiceModal.name[currentLang] || selectedServiceModal.name.hi}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedServiceModal.department.hi}
                </p>
              </div>

              <button
                onClick={onCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-950">
                <span className="font-bold block mb-0.5">संक्षिप्त विवरण:</span>
                <p>{selectedServiceModal.summary[currentLang] || selectedServiceModal.summary.hi}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-600 block font-medium">सरकारी शुल्क:</span>
                  <span className="font-bold text-slate-900">{selectedServiceModal.officialFee}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-600 block font-medium">समय सीमा (Right to Service):</span>
                  <span className="font-bold text-slate-900">{selectedServiceModal.timelineDays} कार्य दिवस</span>
                </div>
              </div>

              {/* Eligibility */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  पात्रता शर्तें (Eligibility Criteria):
                </h4>
                <ul className="space-y-1 text-xs">
                  {selectedServiceModal.eligibility.map((el, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Checklist */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  आवश्यक दस्तावेज (Mandatory Document Checklist):
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <ul className="space-y-1.5 text-xs">
                    {selectedServiceModal.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-800">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Application Centers */}
              <div className="text-xs">
                <span className="font-bold text-slate-900 block mb-1">ऑफलाइन आवेदन केंद्र:</span>
                <p className="bg-slate-100 p-2.5 rounded-lg text-slate-800">
                  {selectedServiceModal.offlineCenter}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  onCloseModal();
                  onAskAboutService(selectedServiceModal.sampleQuestion);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>इस सेवा पर वॉयस असिस्टेंट से बात करें</span>
              </button>

              <a
                href={selectedServiceModal.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                <span>अपणि सरकार पोर्टल पर आवेदन करें</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
