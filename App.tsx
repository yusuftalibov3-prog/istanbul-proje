import React, { useState, useEffect } from 'react';
import { UserRole, SolidarityMessage, ViewState } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TripleEntry from './components/TripleEntry';
import MessageForm from './components/MessageForm';
import MessageFeed from './components/MessageFeed';
import WhyUs from './components/WhyUs';
import { GoogleGenAI } from "@google/genai";



const ISTANBUL_DISTRICTS = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
];
const App: React.FC = () => {
  const [messages, setMessages] = useState<SolidarityMessage[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<ViewState>('landing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [myMessageIds, setMyMessageIds] = useState<string[]>([]);

  // Verileri Yükle
  useEffect(() => {
    const savedMessages = localStorage.getItem('ist_elele_messages');
    const savedIds = localStorage.getItem('ist_elele_my_messages');

   const initialData: SolidarityMessage[] = [];

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(initialData);
    }

    if (savedIds) {
      setMyMessageIds(JSON.parse(savedIds));
    }
  }, []);

  // Verileri Kaydet
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ist_elele_messages', JSON.stringify(messages));
    }
    localStorage.setItem('ist_elele_my_messages', JSON.stringify(myMessageIds));
  }, [messages, myMessageIds]);

  const handleAddMessage = (newMessage: Omit<SolidarityMessage, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    const id = Math.random().toString(36).substr(2, 9);
    const message: SolidarityMessage = {
      ...newMessage,
      id,
      createdAt: Date.now()
    };
    
    setTimeout(() => {
      setMessages(prev => [message, ...prev]);
      setMyMessageIds(prev => [...prev, id]);
      setActiveRole(null);
      setView('feed');
      setIsSubmitting(false);
    }, 800);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
      const updatedMessages = messages.filter(m => m.id !== id);
      const updatedIds = myMessageIds.filter(mid => mid !== id);
      setMessages(updatedMessages);
      setMyMessageIds(updatedIds);
      localStorage.setItem('ist_elele_messages', JSON.stringify(updatedMessages));
      localStorage.setItem('ist_elele_my_messages', JSON.stringify(updatedIds));
    }
  };

  const getAiSummary = async () => {
    if (messages.length === 0) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Aşağıdaki dayanışma mesajlarını kısaca özetle ve bugünün dayanışma ruhunu bir cümleyle anlat. Mesajlar: ${messages.map(m => m.message).join(' | ')}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiSummary(response.text || '');
    } catch (error) {
      console.error('AI Summary failed', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={(v) => { setView(v); setActiveRole(null); }} currentView={view} />
      <main className="flex-grow">
        {view === 'landing' && !activeRole && (
          <>
            <Hero />
            <TripleEntry onSelectRole={(role) => setActiveRole(role)} />
            <WhyUs />
          </>
        )}
        {activeRole && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <button onClick={() => setActiveRole(null)} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
              <i className="fas fa-arrow-left mr-2"></i> Geri Dön
            </button>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{activeRole} Formu</h2>
              <MessageForm role={activeRole} onSubmit={handleAddMessage} isSubmitting={isSubmitting} />
            </div>
          </div>
        )}
        {view === 'feed' && !activeRole && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-slate-900">Canlı Dayanışma Havuzu</h2>
              <div className="flex gap-2">
                <button onClick={() => setView('landing')} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md">
                  <i className="fas fa-plus mr-2"></i> İlan Ver
                </button>
                <button onClick={getAiSummary} className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium hover:bg-emerald-200 transition-all">
                  <i className="fas fa-robot mr-2"></i> Yapay Zeka Özeti
                </button>
              </div>
            </div>
            {aiSummary && (
              <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 flex items-start italic">
                {aiSummary}
              </div>
            )}
            <MessageFeed messages={messages} onDelete={handleDeleteMessage} myMessageIds={myMessageIds} />
          </div>
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <h3 className="text-white text-xl font-bold mb-4">İstanbul El Ele</h3>
        <p className="text-indigo-400 font-semibold italic">Bu web sitesi 14 yaşındaki bir genç girişimci tarafından yapılmıştır.</p>
      </footer>
    </div>
  );
};

export default App;
