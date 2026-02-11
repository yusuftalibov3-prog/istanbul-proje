
import React, { useState } from 'react';
import { UserRole, SolidarityMessage } from '../types';

interface MessageFormProps {
  role: UserRole;
  onSubmit: (data: Omit<SolidarityMessage, 'id' | 'createdAt'>) => void;
  isSubmitting: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({ role, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'İsim Soyisim zorunludur.';
    if (!formData.message.trim()) newErrors.message = 'Mesaj alanı boş bırakılamaz.';
    
    // Turkish Phone validation (starts with 05 and has 11 digits)
    const phoneRegex = /^05\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir Türkiye mobil numarası giriniz (05xx...).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, role });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ad Soyad</label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all`}
            placeholder="Örn: Ahmet Yılmaz"
            value={formData.fullName}
            onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon</label>
          <input
            type="tel"
            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all`}
            placeholder="05xx xxx xx xx"
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
        <input
          type="email"
          className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all`}
          placeholder="ahmet@email.com"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Mesajınız</label>
        <textarea
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all resize-none`}
          placeholder="Dayanışma ilanı detaylarını buraya yazınız..."
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <><i className="fas fa-spinner fa-spin mr-2"></i> Gönderiliyor...</>
        ) : (
          'İlanı Yayınla'
        )}
      </button>
    </form>
  );
};

export default MessageForm;
