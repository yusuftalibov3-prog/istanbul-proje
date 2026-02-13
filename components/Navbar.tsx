import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  isDark: boolean; // Yeni eklendi
  toggleDark: () => void; // Yeni eklendi
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, isDark, toggleDark }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('landing')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            İ
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            İstanbul <span className="text-indigo-600">El Ele</span>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => onNavigate('landing')}
            className={`font-semibold transition-colors ${currentView === 'landing' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
          >
            Ana Sayfa
          </button>
          <button 
            onClick={() => onNavigate('feed')}
            className={`font-semibold transition-colors ${currentView === 'feed' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
          >
            Canlı Mesajlar
          </button>

          {/* Tema Değiştirme Butonu */}
          <button 
            onClick={toggleDark}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-all border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95"
            title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
          >
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          <button 
            onClick={() => onNavigate('landing')}
            className="hidden lg:block px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all"
          >
            Hemen Katıl
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
