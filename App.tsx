// ... importlar aynı ...

const App: React.FC = () => {
  // ... diğer state'ler aynı ...

  // DARK MODE STATE - Başlangıcı daha sağlam yapalım
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // TEMA DEĞİŞİMİ - Bu kısım her iki yöne de (aydınlık/karanlık) kesin hükmeder
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light'); // Ekstra güvenlik
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light'); // Ekstra güvenlik
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // ... Veri yükleme ve kaydetme useEffect'leri aynı ...

  // Mesaj ekleme ve silme fonksiyonları aynı ...

  const getAiSummary = async () => {
    if (messages.length === 0) return;
    try {
      // DİKKAT: Gemini 1.5 Flash veya güncel bir model ismi kullandığından emin ol
      const ai = new GoogleGenAI({ apiKey: "SENIN_API_KEYIN" }); 
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Aşağıdaki dayanışma mesajlarını kısaca özetle ve bugünün dayanışma ruhunu bir cümleyle anlat. Mesajlar: ${messages.map(m => m.message).join(' | ')}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiSummary(response.text());
    } catch (error) {
      console.error('AI Summary failed', error);
      setAiSummary("Özet şu an oluşturulamadı.");
    }
  };

  return (
    // transition-all eklendi, böylece her şey yumuşak değişecek
    <div className="min-h-screen flex flex-col transition-all duration-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      <Navbar 
        onNavigate={(v) => { setView(v); setActiveRole(null); }} 
        currentView={view} 
        isDark={isDark} 
        toggleDark={() => setIsDark(prev => !prev)} 
      />

      <main className="flex-grow">
        {/* İçerik bölümleri aynı kalabilir */}
        {view === 'landing' && !activeRole && (
          <>
            <Hero />
            <TripleEntry onSelectRole={(role) => setActiveRole(role)} />
            <WhyUs />
          </>
        )}

        {activeRole && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <button onClick={() => setActiveRole(null)} className="mb-6 flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fas fa-arrow-left mr-2"></i> Geri Dön
            </button>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 transition-colors">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{activeRole} Formu</h2>
              <MessageForm role={activeRole} onSubmit={handleAddMessage} isSubmitting={isSubmitting} />
            </div>
          </div>
        )}

        {view === 'feed' && !activeRole && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Canlı Dayanışma Havuzu</h2>
              <div className="flex gap-2">
                <button onClick={() => setView('landing')} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md">
                  <i className="fas fa-plus mr-2"></i> İlan Ver
                </button>
                <button onClick={getAiSummary} className="px-6 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-medium hover:bg-emerald-200 transition-all">
                  <i className="fas fa-robot mr-2"></i> Yapay Zeka Özeti
                </button>
              </div>
            </div>
            
            {aiSummary && (
              <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl text-indigo-900 dark:text-indigo-200 flex items-start italic transition-colors">
                <i className="fas fa-sparkles mr-3 mt-1 text-indigo-500"></i>
                {aiSummary}
              </div>
            )}
            
            <MessageFeed messages={messages} onDelete={handleDeleteMessage} myMessageIds={myMessageIds} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12 text-center transition-colors">
        <h3 className="text-white text-xl font-bold mb-4">İstanbul El Ele</h3>
        <p className="text-indigo-400 font-semibold italic">Bu web sitesi 14 yaşındaki bir genç girişimci tarafından yapılmıştır.</p>
      </footer>
    </div>
  );
};

export default App;
