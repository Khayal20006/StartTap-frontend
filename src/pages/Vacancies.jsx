import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, X, Clock, Sparkles } from 'lucide-react';
import { vacancyService } from '../services/api';
import authService from '../services/authService';
import DetailModal from '../components/DetailModal';
import Pagination from '../components/Pagination';
import GlowCard from '../components/GlowCard';
import HeroIllustration from '../components/HeroIllustration';

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ['Bütün', 'AI', 'ECOMMERCE', 'EDTECH', 'FINTECH', 'HEALTHTECH', 'MARKETPLACE', 'SAAS', 'DIGER'];

const Vacancies = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Bütün');
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);

  const createNotification = (title, message, type = 'success') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetch = async () => {
      try { const res = await vacancyService.getAll(); setVacancies(res.data); }
      catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Yükləmək mümkün olmadı.';
        createNotification('Xəta', typeof msg === 'string' ? msg : 'Server xətası', 'error');
      }
      finally { setLoading(false); }
    };
    fetch();
    const user = authService.getCurrentUser();
    if (user) {
      vacancyService.getMyApplications()
        .then(res => setAppliedIds(new Set(res.data.filter(a => a.status !== 'CANCELED').map(a => a.jobId))))
        .catch(() => {});
    }
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const filtered = vacancies.filter(v => {
    const m = (v.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (v.startup?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const c = selectedCategory === 'Bütün' || v.startup?.category === selectedCategory;
    return m && c;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleApply = async (id) => {
    const user = authService.getCurrentUser();
    if (!user) { createNotification('Giriş lazımdır', 'Müraciət üçün giriş edin.', 'error'); return; }
    try {
      await vacancyService.apply(id);
      setAppliedIds(prev => new Set([...prev, id]));
      createNotification('Uğurlu!', 'Müraciətiniz göndərildi.');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('Artıq') || msg.includes('already') || msg.includes('mövcuddur')) {
        setAppliedIds(prev => new Set([...prev, id]));
        createNotification('Artıq müraciət edilib', '', 'error');
      } else createNotification('Xəta', msg || 'Müraciət mümkün olmadı.', 'error');
    }
  };

  const handleCancel = async (id) => {
    try {
      await vacancyService.cancelApplication(id);
      setAppliedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      createNotification('Ləğv edildi', 'Müraciətiniz geri götürüldü.');
    } catch (err) {
      createNotification('Xəta', err.response?.data?.message || 'Ləğv mümkün olmadı.', 'error');
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-ink-950 to-ink-900">
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-ink-900 via-ink-950 to-emerald-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 75% 25%, #10b981 0%, transparent 50%)' }} />
        <div className="page-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div className="flex-1 text-center lg:text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-[10px] font-bold text-emerald-100 tracking-wider uppercase">Karyera İmkanları</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white mb-2">
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Vakansiyalar
                </span>
              </h1>
              <p className="text-base md:text-lg text-emerald-100/80 max-w-xl font-medium mx-auto lg:mx-0">Azərbaycanın ən dinamik startaplarında vakansiyaları kəşf edin.</p>
            </motion.div>
            <motion.div className="w-full max-w-[320px] md:max-w-[400px] lg:max-w-[450px] shrink-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="page-container -mt-6 md:-mt-8 relative z-20">
        <div className="card-dark-glass border-white/10 p-4 md:p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
            <input type="text" placeholder="Vakansiya və ya startap adı..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all duration-150"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`shrink-0 px-3 md:px-4 py-2 text-xs md:text-sm font-bold transition-all duration-150 ${
                  selectedCategory === c ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white/5 text-emerald-100/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs md:text-sm font-semibold text-emerald-100/50">{filtered.length} nəticə</p>
        </div>

        {loading ? (
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-sm bg-white/5 animate-pulse" />)}
          </div>
        ) : paged.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {paged.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03, duration: 0.15 }}>
                <GlowCard onClick={() => setSelectedVacancy(v)}>
                  <div className="card-dark-glass border-white/10 p-4 md:p-6 cursor-pointer">
                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="flex gap-3 md:gap-4 items-start min-w-0">
                        <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <Briefcase className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-white text-sm md:text-base">{v.title}</h3>
                            {appliedIds.has(v.id) ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 gap-1">
                                <Clock className="w-3 h-3" /> Müraciət edilib
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">Aktiv</span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm font-bold text-emerald-400">{v.startup?.name || 'Anonim'}</p>
                          <p className="text-xs md:text-sm text-emerald-100/70 line-clamp-1 mt-1">{v.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 md:gap-2 shrink-0">
                        {appliedIds.has(v.id) ? (
                          <button onClick={(e) => { e.stopPropagation(); handleCancel(v.id); }}
                            className="px-3 py-2 bg-amber-500/10 text-amber-400 text-xs md:text-sm font-bold hover:bg-amber-500/20 transition-all duration-150 border border-amber-500/20">
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleApply(v.id); }}
                            className="px-3 md:px-4 py-2 bg-emerald-600 text-white text-xs md:text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all duration-150">
                            Müraciət et
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card-dark-glass border-white/10">
            <Briefcase className="w-12 h-12 text-emerald-400/40 mx-auto mb-4" />
            <p className="text-emerald-100/60 font-semibold">Heç bir vakansiya tapılmadı.</p>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <DetailModal
        isOpen={!!selectedVacancy}
        onClose={() => setSelectedVacancy(null)}
        vacancy={selectedVacancy}
        applied={selectedVacancy ? appliedIds.has(selectedVacancy.id) : false}
        onApply={handleApply}
        onCancel={handleCancel}
        onViewApplicants={() => navigate('/dashboard')}
      />

      {notification && (
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 px-4 py-3 border shadow-xl max-w-xs backdrop-blur-xl"
          style={{ backgroundColor: notification?.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', borderColor: notification?.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)', color: notification?.type === 'error' ? '#fca5a5' : '#6ee7b7' }}>
          <p className="text-xs font-bold">{notification?.title}</p>
          <p className="text-[10px] mt-0.5 opacity-80">{notification?.message}</p>
        </div>
      )}
    </div>
  );
};

export default Vacancies;
