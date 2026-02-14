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
  
  // DARK MODE STATE
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // TEMA KONTROLÜ - Sadece class ekle/çıkar yapıyoruz, render'ı bozmaz
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Verileri Yükle
  useEffect(() => {
    const savedMessages = localStorage.getItem('ist_elele_messages');
    const savedIds = localStorage.getItem('ist_elele_my_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedIds) setMyMessageIds(JSON.parse(savedIds));
  }, []);

  // Verileri Kaydet
  useEffect(() => {
    localStorage.setItem('ist_elele_messages', JSON.stringify(messages));
    localStorage.setItem('ist_elele_my_messages', JSON.stringify(myMessageIds));
  }, [messages, myMessageIds]);

  const handleAddMessage = (newMessage: Omit<SolidarityMessage, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    const id = Math.random().toString(36).substr(2, 9);
    const message: SolidarityMessage = { ...newMessage, id, createdAt: Date.now() };
    
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
      setMessages(prev => prev.filter(m => m.id !== id));
      setMyMessageIds(prev => prev.filter(mid => mid !== id));
    }
  };

  return (
    // 'dark' sınıfını dinamik olarak en dış sarmalayıcıya da ekliyoruz
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'dark bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      <Navbar 
        onNavigate={(v) => { setView(v); setActiveRole(null); }} 
        currentView={view} 
        isDark={isDark} 
        toggleDark={() => setIsDark(!isDark)} 
      />

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
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
              <h2 className="text-3xl font-bold mb-2">İlan Formu</h2>
              <MessageForm role={activeRole} onSubmit={handleAddMessage} isSubmitting={isSubmitting} />
            </div>
          </div>
        )}

        {view === 'feed' && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8">Canlı Dayanışma Havuzu</h2>
            <MessageFeed messages={messages} onDelete={handleDeleteMessage} myMessageIds={myMessageIds} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <h3 className="text-white text-xl font-bold mb-2">İstanbul El Ele</h3>
        <p className="text-sm">Bu web sitesi 14 yaşındaki bir genç girişimci tarafından yapılmıştır.</p>
      </footer>
    </div>
  );
};

export default App;
