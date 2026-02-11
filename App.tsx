
import React, { useState, useEffect } from 'react';
import { UserRole, SolidarityMessage, ViewState } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TripleEntry from './components/TripleEntry';
import MessageForm from './components/MessageForm';
import MessageFeed from './components/MessageFeed';
import WhyUs from './components/WhyUs';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [messages, setMessages] = useState<SolidarityMessage[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<ViewState>('landing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [myMessageIds, setMyMessageIds] = useState<string[]>([]);

  // Initial dummy data and loading my messages from localStorage
  useEffect(() => {
    const savedIds = localStorage.getItem('ist_elele_my_messages');
    if (savedIds) {
      setMyMessageIds(JSON.parse(savedIds));
    }

    const initialData: SolidarityMessage[] = [
      {
        id: '1',
        fullName: 'Ahmet Yılmaz',
        phone: '05321112233',
        email: 'ahmet@firin.com',
        message: 'Akşam 8\'den sonra fırındaki simitler öğrenciler için ücretsizdir. Lütfen kimliğinizle geliniz.',
        role: UserRole.SHOPKEEPER,
        createdAt: Date.now() - 3600000
      },
      {
        id: '2',
        fullName: 'Ayşe Kaya',
        phone: '05442223344',
        email: 'ayse@veli.com',
        message: 'Beşiktaş - Levent arası okul servisimiz bozuldu. Aynı yöne giden, aracında yer olan veli var mı?',
        role: UserRole.PARENT,
        createdAt: Date.now() - 7200000
      },
      {
        id: '3',
        fullName: 'Can Mert',
        phone: '05553334455',
        email: 'can@edu.tr',
        message: 'YKS kitaplarımı yeni mezun olduğum için ihtiyacı olan bir alt sınıfa hediye etmek istiyorum.',
        role: UserRole.STUDENT,
        createdAt: Date.now() - 10800000
      }
    ];
    setMessages(initialData);
  }, []);

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
      
      // Track this message as "mine" in this browser
      const updatedMyIds = [...myMessageIds, id];
      setMyMessageIds(updatedMyIds);
      localStorage.setItem('ist_elele_my_messages', JSON.stringify(updatedMyIds));

      setActiveRole(null);
      setView('feed');
      setIsSubmitting(false);
    }, 800);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
      setMessages(prev => prev.filter(m => m.id !== id));
      const updatedMyIds = myMessageIds.filter(mid => mid !== id);
      setMyMessageIds(updatedMyIds);
      localStorage.setItem('ist_elele_my_messages', JSON.stringify(updatedMyIds));
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
            <button 
              onClick={() => setActiveRole(null)}
              className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i> Geri Dön
            </button>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {activeRole} Formu
              </h2>
              <p className="text-slate-500 mb-8">Lütfen dayanışma mesajınızı ve iletişim bilgilerinizi giriniz.</p>
              <MessageForm 
                role={activeRole} 
                onSubmit={handleAddMessage} 
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {view === 'feed' && !activeRole && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Canlı Dayanışma Havuzu</h2>
                <p className="text-slate-500">İstanbul'daki güncel yardım ve dayanışma ilanları.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('landing')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  <i className="fas fa-plus mr-2"></i> İlan Ver
                </button>
                <button 
                  onClick={getAiSummary}
                  className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium hover:bg-emerald-200 transition-all"
                >
                  <i className="fas fa-robot mr-2"></i> Yapay Zeka Özeti
                </button>
              </div>
            </div>

            {aiSummary && (
              <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 flex items-start">
                <i className="fas fa-sparkles mt-1 mr-3 text-indigo-500"></i>
                <p className="italic">{aiSummary}</p>
              </div>
            )}

            <MessageFeed 
              messages={messages} 
              onDelete={handleDeleteMessage} 
              myMessageIds={myMessageIds}
            />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-white text-xl font-bold mb-4">İstanbul El Ele</h3>
          <p className="max-w-md mx-auto mb-8">
            Şehrin her köşesinden gelen dayanışma seslerini birleştiriyoruz. Kar amacı gütmeyen, gönüllülük esaslı bir platformdur.
          </p>
          <div className="border-t border-slate-800 pt-8 text-sm flex flex-col gap-2">
            <p>© 2024 İstanbul Dayanışma Portalı. Tüm hakları saklıdır.</p>
            <p className="text-indigo-400 font-semibold italic">Bu web sitesi 14 yaşındaki bir genç girişimci tarafından yapılmıştır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
