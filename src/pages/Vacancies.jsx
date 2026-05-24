import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, DollarSign, Filter, ArrowRight, Sparkles, Building2, X, Clock, Eye } from 'lucide-react';
import { vacancyService } from '../services/api';
import authService from '../services/authService';
import DetailModal from '../components/DetailModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

const CATEGORIES = ['Bütün', 'SAAS', 'FINTECH'];

const Vacancies = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Bütün');
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState({ title: '', sub: '', type: 'success' });
  const [showToast, setShowToast] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const triggerToast = (title, sub, type = 'success') => {
    setToastMessage({ title, sub, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await vacancyService.getAll();
        setVacancies(res.data);
      } catch (err) {
        triggerToast('Xəta', 'Vakansiyaları yükləmək mümkün olmadı.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filteredVacancies = vacancies.filter(v => {
    const matchesSearch = (v.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.startup?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Bütün' || v.startup?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0));

  const totalPages = Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE);
  const pagedVacancies = filteredVacancies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleApply = async (vacancyId) => {
    const user = authService.getCurrentUser();
    if (!user) {
      triggerToast('Giriş lazımdır', 'Müraciət üçün əvvəlcə giriş etməlisiniz.', 'error');
      return;
    }
    try {
      await vacancyService.apply(vacancyId);
      setAppliedIds(prev => new Set([...prev, vacancyId]));
      triggerToast('Uğurlu müraciət!', 'Müraciətiniz komandaya göndərildi.');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('Artıq') || msg.includes('already') || msg.includes('mövcuddur')) {
        setAppliedIds(prev => new Set([...prev, vacancyId]));
        triggerToast('Artıq müraciət edilib', 'Bu vakansiyaya əvvəlcədən müraciət etmisiniz.', 'error');
      } else {
        triggerToast('Xəta', typeof msg === 'string' && msg ? msg : 'Müraciət mümkün olmadı.', 'error');
      }
    }
  };

  const handleCancelApplication = async (vacancyId) => {
    try {
      await vacancyService.cancelApplication(vacancyId);
      setAppliedIds(prev => {
        const next = new Set(prev);
        next.delete(vacancyId);
        return next;
      });
      triggerToast('Ləğv edildi', 'Müraciətiniz geri götürüldü.');
    } catch (err) {
      triggerToast('Xəta', 'Müraciəti ləğv etmək mümkün olmadı.', 'error');
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-24">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] 
                       bg-navy-900 text-white px-5 md:px-7 py-3.5 md:py-4 rounded-2xl 
                       shadow-2xl flex items-center gap-3 md:gap-4 border border-white/10
                       min-w-[280px] md:min-w-[320px] max-w-[90vw]"
          >
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toastMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{toastMessage.title}</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">{toastMessage.sub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative pt-20 md:pt-24 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-emerald-50/30" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-200/15 rounded-full blur-[140px] -z-10 animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-teal-200/10 rounded-full blur-[120px] -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-navy-950 mb-3 md:mb-4 leading-tight">
              Karyeranıza<br /><span className="text-gradient">yeni nəfəs</span> verin
            </h1>
            <p className="text-base md:text-lg text-slate-700 mb-6 md:mb-8 max-w-xl leading-relaxed">
              Azərbaycanın ən dinamik startaplarında vakansiyaları kəşf edin.
            </p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Vakansiya və ya startap adı..."
                className="input-field !pl-11 md:!pl-14 !py-3.5 md:!py-4 text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          <aside className="w-full lg:w-56 xl:w-60 shrink-0">
            <div className="sticky top-24">
              <div className="card p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 md:mb-5">
                  <Filter className="w-3.5 h-3.5" /> Filtrlər
                </div>
                <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 lg:w-full text-left px-4 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'bg-navy-900 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'Bütün' ? 'Bütün' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-navy-950">
                {filteredVacancies.length} <span className="text-slate-600 font-medium">nəticə</span>
                {totalPages > 1 && <span className="text-slate-400 font-medium"> — səhifə {currentPage}/{totalPages}</span>}
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-28 md:h-32 shimmer" />)}
              </div>
            ) : filteredVacancies.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                <AnimatePresence mode="popLayout">
                  {pagedVacancies.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      layout
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedVacancy(v)}
                      className="card p-5 md:p-6 cursor-pointer group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                        <div className="flex gap-3 md:gap-5 items-start min-w-0">
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                            <Building2 className="w-5 h-5 md:w-7 md:h-7 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                              <h3 className="text-base md:text-xl font-bold text-navy-950 truncate">{v.title}</h3>
                              {appliedIds.has(v.id) ? (
                                <span className="badge-amber text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0">
                                  <Clock className="w-3 h-3" /> Müraciət edilib
                                </span>
                              ) : (
                                <span className="badge-green text-[10px] uppercase tracking-wider shrink-0">Aktiv</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                              <span className="font-bold text-emerald-600">{v.startup?.name || 'Anonim Startap'}</span>
                              {v.startup?.category && (
                                <span className="badge-slate text-[10px]">{v.startup.category}</span>
                              )}
                              {v.applicationCount !== undefined && (
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {v.applicationCount} müraciət
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedVacancy(v); }}
                            className="w-10 h-10 md:w-11 md:h-11 bg-slate-100 hover:bg-slate-200 rounded-xl 
                                       flex items-center justify-center text-slate-600
                                       active:scale-90 transition-all duration-200"
                            title="Ətraflı bax"
                          >
                            <Eye className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          </button>
                          {appliedIds.has(v.id) ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancelApplication(v.id); }}
                              className="inline-flex items-center gap-1.5 px-4 md:px-5 py-2.5 md:py-3 bg-amber-50 text-amber-700 
                                         text-xs md:text-sm font-bold rounded-xl hover:bg-amber-100 border border-amber-200/50 
                                         active:scale-90 transition-all"
                            >
                              <X className="w-3.5 h-3.5 md:w-4 md:h-4" /> Ləğv et
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApply(v.id); }}
                              className="btn-primary !rounded-xl px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm"
                            >
                              Müraciət et <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {v.description && (
                        <p className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-slate-100 text-xs md:text-sm text-slate-700 leading-relaxed line-clamp-2">
                          {v.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-lg border-dashed border-slate-300 p-12 md:p-20 text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 border border-slate-200">
                  <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-slate-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy-950 mb-2">Heç bir vakansiya tapılmadı</h3>
                <p className="text-xs md:text-sm text-slate-600 max-w-xs mx-auto">
                  Axtarış meyarlarınıza uyğun nəticə yoxdur. Fərqli açar sözlərlə yoxlayın.
                </p>
              </motion.div>
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      <DetailModal
        isOpen={!!selectedVacancy}
        onClose={() => setSelectedVacancy(null)}
        vacancy={selectedVacancy}
        applied={selectedVacancy ? appliedIds.has(selectedVacancy.id) : false}
        onApply={handleApply}
        onCancel={handleCancelApplication}
        onViewApplicants={() => navigate('/dashboard')}
      />
      </div>
    </div>
  );
};

export default Vacancies;
