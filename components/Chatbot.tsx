import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Merhaba! Ben İstanbul El Ele asistanıyım. Size nasıl yardımcı olabilirim?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Vercel'e eklediğin anahtarı buradan okuyacak
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
    
    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Hata: API anahtarı bulunamadı.' }]);
      return;
    }

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(`Sen İstanbul El Ele platformu asistanısın. Samimi ol. Soru: ${userText}`);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Üzgünüm, şu an cevap veremiyorum.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl border dark:border-slate-800 flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              AI Destek
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none border dark:border-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-slate-400 animate-pulse italic p-2">Cevap yazılıyor...</div>}
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              className="flex-grow p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 ring-indigo-500 text-sm" 
              placeholder="Sorunuzu buraya yazın..." 
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all group">
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} group-hover:rotate-12`}></i>
      </button>
    </div>
  );
};

export default Chatbot;
