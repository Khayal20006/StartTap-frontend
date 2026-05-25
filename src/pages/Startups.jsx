import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Users, Sparkles } from 'lucide-react';
import { startupService } from '../services/api';
import DetailModal from '../components/DetailModal';
import Pagination from '../components/Pagination';
import GlowCard from '../components/GlowCard';
import HeroIllustration from '../components/HeroIllustration';

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ['Bütün', 'AI', 'ECOMMERCE', 'EDTECH', 'FINTECH', 'HEALTHTECH', 'MARKETPLACE', 'SAAS', 'DIGER'];

const Startups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Bütün');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);

  const createNotification = (title, message, type = 'success') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetch = async () => {
      try { const res = await startupService.getAll(); setStartups(res.data); }
      catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Yükləmək mümkün olmadı.';
        createNotification('Xəta', typeof msg === 'string' ? msg : 'Server xətası', 'error');
      }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const filtered = startups.filter(s => {
    const q = searchTerm.toLowerCase();
    return (!q || s.name?.toLowerCase().includes(q) || s.tagline?.toLowerCase().includes(q));
  }).filter(s => selectedCategory === 'Bütün' || s.category === selectedCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-ink-950 to-ink-900">
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-ink-900 via-ink-950 to-emerald-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%)' }} />
        <div className="page-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div className="flex-1 text-center lg:text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-[10px] font-bold text-emerald-100 tracking-wider uppercase">İnnovativ Layihələr</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white mb-2">
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Startaplar
                </span>
              </h1>
              <p className="text-base md:text-lg text-emerald-100/80 max-w-xl font-medium mx-auto lg:mx-0">Azərbaycanın ən perspektivli startaplarını kəşf edin.</p>
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
            <input type="text" placeholder="Startap adı, sloqan..."
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 rounded-sm bg-white/5 animate-pulse" />)}
          </div>
        ) : paged.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {paged.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03, duration: 0.15 }}>
                <GlowCard onClick={() => setSelectedStartup(s)}>
                  <div className="card-dark-glass border-white/10 p-5 md:p-6 cursor-pointer">
                    <div className="flex items-start gap-3 md:gap-4 mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-base md:text-lg shrink-0 shadow-lg shadow-emerald-600/20">
                        {s.name?.[0] || 'S'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm md:text-base">{s.name}</h3>
                        {s.tagline && <p className="text-xs md:text-sm font-semibold text-emerald-400">{s.tagline}</p>}
                        {s.stage && <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">{s.stage}</span>}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-emerald-100/70 line-clamp-2 leading-relaxed">{s.description || 'Təsvir yoxdur'}</p>
                    <div className="flex items-center gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
                      {s.category && <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 text-emerald-100/70 border border-white/10">{s.category}</span>}
                      {s.owner && (
                        <span className="text-[10px] font-medium text-emerald-100/50 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {s.owner.firstname} {s.owner.lastname}
                        </span>
                      )}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card-dark-glass border-white/10">
            <Building2 className="w-12 h-12 text-emerald-400/40 mx-auto mb-4" />
            <p className="text-emerald-100/60 font-semibold">Heç bir startap tapılmadı.</p>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <DetailModal isOpen={!!selectedStartup} onClose={() => setSelectedStartup(null)} startup={selectedStartup} />

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

export default Startups;
