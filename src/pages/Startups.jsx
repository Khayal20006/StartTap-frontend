import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Building2, Users, Filter, ArrowRight, X } from 'lucide-react';
import { startupService } from '../services/api';
import DetailModal from '../components/DetailModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

const CATEGORIES = ['Bütün', 'SAAS', 'FINTECH'];

const Startups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Bütün');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState({ title: '', sub: '', type: 'success' });
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (title, sub, type = 'success') => {
    setToastMessage({ title, sub, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await startupService.getAll();
        setStartups(res.data);
      } catch (err) {
        triggerToast('Xəta', 'Startapları yükləmək mümkün olmadı.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filteredStartups = startups.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      s.name?.toLowerCase().includes(q) ||
      s.tagline?.toLowerCase().includes(q) ||
      s.owner?.firstname?.toLowerCase().includes(q) ||
      s.owner?.lastname?.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'Bütün' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredStartups.length / ITEMS_PER_PAGE);
  const pagedStartups = filteredStartups.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-emerald-200/15 rounded-full blur-[140px] -z-10 animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-200/10 rounded-full blur-[120px] -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-navy-950 mb-3 md:mb-4 leading-tight">
              Azərbaycanın<br /><span className="text-gradient">ən perspektivli</span> startapları
            </h1>
            <p className="text-base md:text-lg text-slate-700 mb-6 md:mb-8 max-w-xl leading-relaxed">
              İdeyadan komandaya, komandadan uğura — StartTap ekosistemini kəşf edin.
            </p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Startap adı, sloqan və ya sahib..."
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
                {filteredStartups.length} <span className="text-slate-600 font-medium">startap</span>
                {totalPages > 1 && <span className="text-slate-400 font-medium"> — səhifə {currentPage}/{totalPages}</span>}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-44 md:h-48 shimmer" />)}
              </div>
            ) : filteredStartups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <AnimatePresence mode="popLayout">
                  {pagedStartups.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      layout
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedStartup(s)}
                      className="card p-5 md:p-6 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 md:gap-4 mb-4">
                        <div className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md shrink-0">
                          {s.name?.[0] || 'S'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-base md:text-lg font-bold text-navy-950 truncate group-hover:text-emerald-700 transition-colors">{s.name}</h3>
                            {s.stage && (
                              <span className="badge-emerald text-[10px] uppercase tracking-wider shrink-0">{s.stage}</span>
                            )}
                          </div>
                          {s.tagline && (
                            <p className="text-xs font-semibold text-emerald-600 truncate">{s.tagline}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-slate-700 line-clamp-2 leading-relaxed mb-4 min-h-[2rem]">
                        {s.description || 'Təsvir yoxdur'}
                      </p>

                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 min-w-0">
                          {s.category && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{s.category}</span>
                          )}
                          {s.owner && (
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate">
                              <Users className="w-3 h-3 shrink-0" /> {s.owner.firstname} {s.owner.lastname}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedStartup(s); }}
                          className="w-8 h-8 bg-slate-100 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-all shrink-0"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
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
                  <Building2 className="w-8 h-8 md:w-10 md:h-10 text-slate-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy-950 mb-2">Heç bir startap tapılmadı</h3>
                <p className="text-xs md:text-sm text-slate-600 max-w-xs mx-auto">
                  Axtarış meyarlarınıza uyğun nəticə yoxdur. Fərqli açar sözlərlə yoxlayın.
                </p>
              </motion.div>
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedStartup}
        onClose={() => setSelectedStartup(null)}
        startup={selectedStartup}
      />
    </div>
  );
};

export default Startups;
