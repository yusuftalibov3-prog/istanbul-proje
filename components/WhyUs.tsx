
import React from 'react';

const WhyUs: React.FC = () => {
  const comparison = [
    { old: 'Karışık ilan sayfaları ve karmaşa', new: 'Kategorize edilmiş, temiz ve net mesajlar', icon: 'fa-layer-group' },
    { old: 'Güven vermeyen anonim paylaşımlar', new: 'İletişim bilgileri doğrulanmış gerçek kişiler', icon: 'fa-user-check' },
    { old: 'Yalnızca büyük yardımlara odaklanma', new: 'Esnaftan veliye, en küçük dayanışma imkanı', icon: 'fa-hand-holding-heart' },
    { old: 'Zor ve yavaş iletişim süreçleri', new: 'Tek tıkla doğrudan telefon ile ulaşım', icon: 'fa-bolt' },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Neden İstanbul El Ele?</h2>
          <p className="text-slate-600">Eski sistemin eksiklerini kapatıyor, modern şehircilikte dayanışmayı dijitalleştiriyoruz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xl font-bold text-red-500 mb-8 flex items-center">
              <i className="fas fa-times-circle mr-3"></i> Klasik Sistemler
            </h3>
            <ul className="space-y-6">
              {comparison.map((item, idx) => (
                <li key={idx} className="flex items-start text-slate-400 line-through">
                  <i className="fas fa-times mt-1 mr-4"></i>
                  <span>{item.old}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <i className="fas fa-check-circle text-8xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl font-bold text-indigo-600 mb-8 flex items-center">
              <i className="fas fa-check-circle mr-3"></i> İstanbul El Ele
            </h3>
            <ul className="space-y-6">
              {comparison.map((item, idx) => (
                <li key={idx} className="flex items-start text-slate-800 font-medium">
                  <i className="fas fa-check mt-1 mr-4 text-emerald-500"></i>
                  <span>{item.new}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
