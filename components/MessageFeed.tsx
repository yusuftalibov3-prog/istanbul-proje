
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
                          m.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT: return 'bg-indigo-100 text-indigo-700';
      case UserRole.SHOPKEEPER: return 'bg-emerald-100 text-emerald-700';
      case UserRole.PARENT: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="İlanlar içinde ara (isim veya mesaj)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
          >
            Tümü
          </button>
          {Object.values(UserRole).map(role => (
            <button 
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === role ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
            >
              {role}lar
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col hover:border-indigo-200 transition-all group relative"
            >
              {myMessageIds.includes(msg.id) && (
                <button 
                  onClick={() => onDelete(msg.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  title="İlanı Sil"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(msg.role)}`}>
                  {msg.role}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              
              <p className="text-slate-800 font-medium leading-relaxed flex-grow mb-6">
                "{msg.message}"
              </p>
              
              <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                    {msg.fullName[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{msg.fullName}</h4>
                    <p className="text-xs text-slate-500">{msg.email}</p>
                  </div>
                </div>
                <a 
                  href={`tel:${msg.phone}`} 
                  className="w-full py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <i className="fas fa-phone-alt mr-2 text-xs"></i> {msg.phone}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sonuç Bulunamadı</h3>
            <p className="text-slate-500">Aramanıza veya filtrenize uygun mesaj bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFeed;
