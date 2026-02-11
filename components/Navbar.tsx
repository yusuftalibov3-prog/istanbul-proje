
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('landing')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            İ
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">İstanbul <span className="text-indigo-600">El Ele</span></span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('landing')}
            className={`font-semibold transition-colors ${currentView === 'landing' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Ana Sayfa
          </button>
          <button 
            onClick={() => onNavigate('feed')}
            className={`font-semibold transition-colors ${currentView === 'feed' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Canlı Mesajlar
          </button>
          <button 
            onClick={() => onNavigate('landing')}
            className="hidden sm:block px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all"
          >
            Hemen Katıl
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
