import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, ArrowRight, X, Clock, Eye, Sparkles } from 'lucide-react';
import { vacancyService } from '../services/api';
import authService from '../services/authService';
import DetailModal from '../components/DetailModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ['Bütün', 'AI', 'ECOMMERCE', 'EDTECH', 'FINTECH', 'HEALTHTECH', 'MARKETPLACE', 'SAAS', 'DIGER'];

const stagger = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

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
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await vacancyService.getAll();
        setVacancies(res.data);
      } catch (err) {
        createNotification('Xəta', 'Vakansiyaları yükləmək mümkün olmadı.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();

    const user = authService.getCurrentUser();
    if (user) {
      vacancyService.getMyApplications()
        .then(res => setAppliedIds(new Set(res.data.filter(a => a.status !== 'CANCELED').map(a => a.jobId))))
        .catch(() => {});
    }
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const filtered = vacancies.filter(v => {
    const m = (v.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
              (v.startup?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
      } else {
        createNotification('Xəta', msg || 'Müraciət mümkün olmadı.', 'error');
      }
    }
  };

  const handleCancel = async (id) => {
    try {
      await vacancyService.cancelApplication(id);
      setAppliedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      createNotification('Ləğv edildi', 'Müraciətiniz geri götürüldü.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Ləğv etmək mümkün olmadı.';
      createNotification('Xəta', msg, 'error');
    }
  };

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Hero Header */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/80 to-teal-950/85" />
        </div>
        <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] bg-teal-300/8 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-[10px] font-bold text-emerald-100 tracking-wider uppercase">Karyera İmkanları</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2">Vakansiyalar</h1>
            <p className="text-base md:text-lg text-emerald-100/80 max-w-xl font-medium">Azərbaycanın ən dinamik startaplarında vakansiyaları kəşf edin.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card rounded-2xl p-4 md:p-5 mb-6 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" placeholder="Vakansiya və ya startap adı..."
              className="input-simple !pl-10 !py-2.5 text-sm !rounded-xl"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === c ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs md:text-sm font-semibold text-slate-500">{filtered.length} nəticə</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 shimmer rounded-2xl" />)}</div>
        ) : paged.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {paged.map(v => (
              <motion.div
                key={v.id}
                variants={fadeUp}
                onClick={() => setSelectedVacancy(v)}
                className="card p-5 md:p-6 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start min-w-0">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-navy-950">{v.title}</h3>
                        {appliedIds.has(v.id) ? (
                          <span className="badge-amber text-[10px] flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" /> Müraciət edilib
                          </span>
                        ) : (
                          <span className="badge-emerald text-[10px] shrink-0">Aktiv</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-emerald-600">{v.startup?.name || 'Anonim'}</p>
                      <p className="text-sm text-slate-600 line-clamp-1 mt-1">{v.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {appliedIds.has(v.id) ? (
                      <button onClick={(e) => { e.stopPropagation(); handleCancel(v.id); }}
                        className="px-3 py-2 bg-amber-50 text-amber-700 text-sm font-bold rounded-xl hover:bg-amber-100 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleApply(v.id); }}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/15">
                        Müraciət et
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">Heç bir vakansiya tapılmadı.</p>
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
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl border max-w-sm backdrop-blur-xl ${
            notification.type === 'error' ? 'bg-red-50/90 border-red-200/80 text-red-800' : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-800'
          }`}
        >
          <p className="text-sm font-bold">{notification.title}</p>
          {notification.message && <p className="text-xs mt-0.5 opacity-80">{notification.message}</p>}
        </motion.div>
      )}
    </div>
  );
};

export default Vacancies;
