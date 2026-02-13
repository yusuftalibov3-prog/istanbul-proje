import React, { useState } from 'react';
import { SolidarityMessage, UserRole } from '../types';

interface MessageFeedProps {
  messages: SolidarityMessage[];
  onDelete: (id: string) => void;
  myMessageIds: string[];
}

const MessageFeed: React.FC<MessageFeedProps> = ({ messages, onDelete, myMessageIds }) => {
  const [filter, setFilter] = useState<UserRole | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = messages.filter(m => {
    const matchesFilter = filter === 'all' || m.role === filter;
    const matchesSearch = m.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (m.district && m.district.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT: return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case UserRole.SHOPKEEPER: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case UserRole.PARENT: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div>
      {/* Filtreleme ve Arama Alanı */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="İlanlar içinde ara (isim, mesaj veya ilçe)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Tümü
          </button>
          {Object.values(UserRole).map(role => (
            <button 
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === role ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {role}lar
            </button>
          ))}
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col hover:border-indigo-200 dark:hover:border-indigo-500 transition-all group relative"
            >
              {myMessageIds.includes(msg.id) && (
                <button 
                  onClick={() => onDelete(msg.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  title="İlanı Sil"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(msg.role)}`}>
                  {msg.role}
                </span>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">{msg.district || 'İstanbul'}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed flex-grow mb-6 italic">
                "{msg.message}"
              </p>
              
              <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                    {msg.fullName[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{msg.fullName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{msg.email}</p>
                  </div>
                </div>
                <a 
                  href={`tel:${msg.phone}`} 
                  className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <i className="fas fa-phone-alt mr-2 text-xs"></i> {msg.phone}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600 text-3xl">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Sonuç Bulunamadı</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFeed;
