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

  // Verileri ve Mesajları Yükle
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

  // Mesaj ID'lerini Kaydet (Hata Buradaydı, Düzeltildi)
  useEffect(() => {
    localStorage.setItem('ist_elele_my_messages', JSON.stringify(myMessageIds));
  }, [myMessageIds]);

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
      const updatedMyIds = [...myMessageIds, id];
      setMyMessageIds(updatedMyIds);
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
              className="mb-6 flex items-center text-slate-500 hover:text-indigo-6
