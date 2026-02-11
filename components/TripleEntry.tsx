
import React from 'react';
import { UserRole } from '../types';

interface TripleEntryProps {
  onSelectRole: (role: UserRole) => void;
}

const TripleEntry: React.FC<TripleEntryProps> = ({ onSelectRole }) => {
  const roles = [
    {
      title: 'Ben Öğrenciyim',
      role: UserRole.STUDENT,
      icon: 'fa-graduation-cap',
      desc: 'İhtiyaçlarını paylaş, burs veya kaynak desteği bul.',
      color: 'bg-indigo-500',
      shadow: 'shadow-indigo-100'
    },
    {
      title: 'Ben Esnafım',
      role: UserRole.SHOPKEEPER,
      icon: 'fa-store',
      desc: 'Öğrencilere destek ol, kampanya duyur, iyiliği yay.',
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-100'
    },
    {
      title: 'Ben Veliyim',
      role: UserRole.PARENT,
      icon: 'fa-users',
      desc: 'Okul ulaşımı, kitap ve eğitim yardımlaşmasına katıl.',
      color: 'bg-blue-500',
      shadow: 'shadow-blue-100'
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roles.map((item) => (
          <button
            key={item.role}
            onClick={() => onSelectRole(item.role)}
            className={`group text-left p-8 bg-white border border-slate-100 rounded-3xl transition-all hover:scale-[1.02] hover:shadow-2xl ${item.shadow}`}
          >
            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:rotate-6 transition-transform`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-500 leading-relaxed mb-6">{item.desc}</p>
            <div className="flex items-center text-indigo-600 font-bold">
              Mesajını Yaz <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default TripleEntry;
