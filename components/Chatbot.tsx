import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: 'Merhaba! Ben İstanbul El Ele asistanıyım. Size nasıl yardımcı olabilirim?'}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // --- ÖNEMLİ: API KEY KONTROLÜ ---
    // Buraya Google AI Studio'dan aldığın gerçek key'i tırnak içine yapıştır.
    const API_KEY = "	
gen-lang-client-0429309084"; 
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    if (API_KEY.includes("BURAYA")) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Hata: Lütfen Chatbot.tsx dosyasına geçerli bir API Key ekleyin.' }]);
      setIsLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Sen "İstanbul El Ele" platformunun yardımcı asistanısın. 
      Bu platform öğrencilerin, esnafların ve velilerin dayanışması için kuruldu. 
      Kısa, samimi ve yapıcı cevaplar ver. Soru: ${userText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Üzgünüm, şu an cevap veremiyorum. Lütfen sonra tekrar dene.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden mb-4 transition-all">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fas fa-robot"></i>
              <span className="font-bold">AI Destek</span>
            </div>
            <button onClick={() => setIsOpen(false)}><i className="fas fa-times"></i></button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-slate-400 animate-pulse">Düşünüyorum...</div>}
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Sorunuzu yazın..."
              className="flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            />
            <button onClick={handleSend} className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all"
      >
        <i className={`fas ${isOpen ? 'fa-comment-slash' : 'fa-robot'}`}></i>
      </button>
    </div>
  );
};

export default Chatbot;
