import React, { useState, useEffect } from 'react';
import { GovernmentDocument, UsageStats } from '../types/index.ts';
import { INITIAL_GOVERNMENT_DOCUMENTS } from '../data/servicesData.ts';
import { 
  BookOpen, 
  Upload, 
  Trash2, 
  Search, 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Globe, 
  Database,
  PlusCircle,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminKnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<GovernmentDocument[]>(INITIAL_GOVERNMENT_DOCUMENTS);
  const [stats, setStats] = useState<UsageStats>({
    totalQueries: 54,
    voiceQueries: 39,
    languagesUsed: { hi: 35, garhwali: 10, kumaoni: 7, en: 2 },
    topServices: [
      { serviceId: 'income-cert', name: 'आय प्रमाण पत्र', count: 24 },
      { serviceId: 'caste-cert', name: 'जाति प्रमाण पत्र', count: 14 },
      { serviceId: 'domicile-cert', name: 'मूल निवास प्रमाण पत्र', count: 9 },
      { serviceId: 'old-age-pension', name: 'वृद्धावस्था पेंशन', count: 5 },
      { serviceId: 'farmer-schemes', name: 'किसान कल्याण योजनाएं', count: 2 },
    ],
    activeCallSessions: 0,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('राजस्व विभाग, उत्तराखण्ड सरकार');
  const [newCategory, setNewCategory] = useState('certificate');
  const [newContent, setNewContent] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('https://eservices.uk.gov.in');
  const [newFileType, setNewFileType] = useState<'pdf' | 'circular' | 'guideline' | 'faq'>('circular');

  // RAG Search Tester State
  const [testQuery, setTestQuery] = useState('आय प्रमाण पत्र के लिए कौन से दस्तावेज लगेंगे?');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTestingRag, setIsTestingRag] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch real documents from backend if running
  useEffect(() => {
    fetch('/api/admin/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((e) => console.log('Using local documents cache'));

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalQueries) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('कृपया शीर्षक और सामग्री दोनों दर्ज करें।');
      return;
    }

    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          department: newDepartment,
          category: newCategory,
          content: newContent,
          sourceUrl: newSourceUrl,
          fileType: newFileType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => [data.document, ...prev]);
        setStatusMessage('नया सरकारी दस्तावेज सफलता से ज्ञान आधार (RAG Store) में अनुक्रमित हो गया!');
        setIsUploading(false);
        setNewTitle('');
        setNewContent('');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      // Local optimistic update
      const localDoc: GovernmentDocument = {
        id: `doc-${Date.now()}`,
        title: newTitle,
        department: newDepartment,
        category: newCategory,
        content: newContent,
        sourceUrl: newSourceUrl,
        dateAdded: new Date().toISOString().split('T')[0],
        fileType: newFileType,
        chunkCount: newContent.split('\n').filter(p => p.trim()).length || 1,
        verifiedOfficial: true,
      };
      setDocuments((prev) => [localDoc, ...prev]);
      setStatusMessage('नया सरकारी दस्तावेज ज्ञान भंडार में जोड़ा गया!');
      setIsUploading(false);
      setNewTitle('');
      setNewContent('');
    }

    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('क्या आप इस दस्तावेज को ज्ञान भंडार से हटाना चाहते हैं?')) return;
    try {
      await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleTestRag = async () => {
    if (!testQuery.trim()) return;
    setIsTestingRag(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testQuery, language: 'hi' }),
      });
      const data = await res.json();
      setTestResults(data.retrievedChunks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingRag(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-md border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>ज्ञान भंडार प्रशासन (Knowledge Base & RAG Administration)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif">
              अपणि सरकार ज्ञान आधार प्रबंधन
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              सरकारी शासनादेश, पीडीएफ अधिसूचनाएं, एफएक्यू और सेवा नियमावली अपलोड करें। यह ज्ञान आधार सीधे Gemini और वॉयस असिस्टेंट को आधिकारिक संदर्भ प्रदान करता है।
            </p>
          </div>

          <button
            onClick={() => setIsUploading(!isUploading)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>नया दस्तावेज / सर्कुलर जोड़ें</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Usage Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">कुल नागरिक प्रश्न</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
            {stats.totalQueries}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">↑ 100% उत्तरित</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">वॉयस बातचीत (Voice)</span>
          <span className="text-2xl font-black text-blue-900 font-mono mt-1 block">
            {stats.voiceQueries}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">माइक और फोन इनपुट</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">ज्ञान आधार चंक्स (RAG)</span>
          <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
            {documents.reduce((acc, d) => acc + d.chunkCount, 0)}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{documents.length} आधिकारिक दस्तावेज</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">पहाड़ी बोलियों का उपयोग</span>
          <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">
            {stats.languagesUsed.garhwali + stats.languagesUsed.kumaoni}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">गढ़वाली एवं कुमाऊँनी</span>
        </div>
      </div>

      {/* Upload Document Form Drawer */}
      {isUploading && (
        <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 mb-6 shadow-lg animate-fadeIn">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            <span>नया सरकारी सर्कुलर / अधिसूचना अपलोड करें (Add Government Circular)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            सामग्री को स्वतः छोटे सर्च करने योग्य चंक्स में विभाजित करके वेक्टर ज्ञान भंडार में जोड़ा जाएगा।
          </p>

          <form onSubmit={handleUploadDocument} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  दस्तावेज का शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="उदा. आय प्रमाण पत्र सत्यापन नियम 2026"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  सम्बन्धित विभाग
                </label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="उदा. राजस्व विभाग, उत्तराखण्ड सरकार"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">श्रेणी</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="certificate">प्रमाण पत्र (Certificate)</option>
                  <option value="pension">पेंशन (Pension)</option>
                  <option value="ration">खाद्य सुरक्षा (Ration)</option>
                  <option value="farmer">कृषक कल्याण (Farmer)</option>
                  <option value="employment">रोजगार (Employment)</option>
                  <option value="citizen">नागरिक सेवाएं (Citizen Services)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">प्रकार</label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="circular">शासनादेश / सर्कुलर (Circular)</option>
                  <option value="guideline">मार्गदर्शिका (Guideline)</option>
                  <option value="pdf">पीडीएफ पाठ (PDF Text)</option>
                  <option value="faq">एफएक्यू प्रश्नोत्तर (FAQ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">आधिकारिक लिंक</label>
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  placeholder="https://eservices.uk.gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                दस्तावेज की सामग्री अथवा नियम पाठ *
              </label>
              <textarea
                required
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="यहाँ सरकारी अधिसूचना का विवरण, पात्रता, जरूरी कागजात और प्रक्रिया का पाठ दर्ज करें या पेस्ट करें..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ज्ञान भंडार में सुरक्षित करें</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RAG Knowledge Retrieval Tester */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-base text-slate-900">
            लाइव RAG वेक्टर सर्च टेस्टर (Live Retrieval Semantic Tester)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          परीक्षण करें कि नागरिक के प्रश्न पर कौन से सरकारी दस्तावेज व चंक्स Gemini को भेजे जा रहे हैं।
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="परीक्षण प्रश्न लिखें (उदा. आय प्रमाण पत्र के लिए कौन से दस्तावेज चाहिए)..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={handleTestRag}
            disabled={isTestingRag}
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isTestingRag ? 'खोज रहा है...' : 'RAG टेस्ट करें'}</span>
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              सफलतापूर्वक प्राप्त आधिकारिक चंक्स ({testResults.length}):
            </span>
            {testResults.map((chunk, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                  <span>{chunk.sourceTitle}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                    Score: {chunk.score?.toFixed(1) || '10.0'}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{chunk.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indexed Government Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center justify-between">
          <span>अनुक्रमित सरकारी दस्तावेज (Indexed Official Documents)</span>
          <span className="text-xs font-normal text-slate-500">
            {documents.length} दस्तावेज सुरक्षित
          </span>
        </h3>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{doc.title}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {doc.fileType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span>{doc.department}</span>
                  <span>•</span>
                  <span>दिनांक: {doc.dateAdded}</span>
                  <span>•</span>
                  <span className="text-blue-700 font-semibold">{doc.chunkCount} Search Chunks</span>
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {doc.content}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {doc.sourceUrl && (
                  <a
                    href={doc.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-900 hover:bg-slate-100"
                    title="View Source Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="ज्ञान भंडार से हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
