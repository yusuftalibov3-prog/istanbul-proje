
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full">
          Şehir Veri ve Dayanışma Merkezi
        </span>
        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Sesini Duyur, Elini Uzat, <br />
          <span className="text-indigo-600">Şehri Değiştir.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Bu platform; öğrencilerin, esnafların ve velilerin doğrudan iletişim kurması için kurulmuş, kar amacı gütmeyen bir dijital meydandır.
        </p>
      </div>
      
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
    </section>
  );
};

export default Hero;
