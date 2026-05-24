import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Zap, TrendingUp, ShieldCheck, Clock, Eye, X, ChevronDown, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { vacancyService, startupService } from '../services/api';
import authService from '../services/authService';
import DetailModal from '../components/DetailModal';

const features = [
  {
    icon: <Zap className="w-7 h-7" />,
    title: "İldırım Sürəti",
    desc: "Profilinizi saniyələr içində yaradın və dərhal ekosistemə qoşulun.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Peşəkar Komanda",
    desc: "Sizinlə eyni amalı paylaşan yüksək ixtisaslı mütəxəssisləri asanlıqla tapın.",
    gradient: "from-navy-600 to-navy-800",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: "Limitsiz İnkişaf",
    desc: "Startapınızı böyütmək üçün lazım olan bütün alətlər və dəstək buradadır.",
    gradient: "from-teal-500 to-emerald-600",
  }
];

const stats = [
  { label: "Startap", value: "500+" },
  { label: "İstifadəçi", value: "10k+" },
  { label: "Vakansiya", value: "2.5k+" },
  { label: "Yatırım", value: "₼2M+" }
];

const Home = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState({ title: '', sub: '', type: 'success' });
  const [showToast, setShowToast] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const triggerToast = (title, sub, type = 'success') => {
    setToastMessage({ title, sub, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await vacancyService.getAll();
        setVacancies(res.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchStartups = async () => {
      try {
        const res = await startupService.getAll();
        setStartups(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStartups(false);
      }
    };
    fetchVacancies();
    fetchStartups();
  }, []);

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
    <div className="overflow-hidden">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] 
                       bg-navy-900 text-white px-5 md:px-7 py-3.5 md:py-4 
                       rounded-[1.25rem] shadow-2xl 
                       flex items-center gap-3 md:gap-4 border border-white/10
                       min-w-[280px] md:min-w-[320px] max-w-[90vw]"
          >
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toastMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{toastMessage.title}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">{toastMessage.sub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroBgY, scale: heroScale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-emerald-950/80 to-navy-950/95 z-10" />
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 z-20" />
          <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[130px] animate-pulse-glow z-10" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse-glow z-10" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] right-[30%] w-[250px] h-[250px] bg-emerald-400/8 rounded-full blur-[100px] animate-pulse-glow z-10" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 opacity-[0.03] z-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </motion.div>

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: heroOpacity }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6 md:mb-8 hover:bg-white/15 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">Azərbaycanın №1 Startap Platforması</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.9] mb-6 md:mb-8"
            >
              Gələcəyi
              <br />
              <span className="text-gradient-light">birlikdə</span>
              {' '}quraq
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg lg:text-xl text-emerald-100/80 max-w-2xl leading-relaxed mb-8 md:mb-12"
            >
              StartTap — İdeyalarınızı reallığa çevirmək üçün lazım olan hər şeyi bir araya gətirir.
              Komandanızı qurun, investorları tapın və böyüyün.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-emerald-600 text-white font-bold text-base md:text-lg 
                           rounded-2xl hover:bg-emerald-700 active:scale-[0.97] transition-all duration-300
                           shadow-[0_8px_30px_rgba(5,150,105,0.3)] hover:shadow-[0_12px_40px_rgba(5,150,105,0.4)]"
              >
                İndi başla <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <Link
                to="/vacancies"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-white/10 backdrop-blur-md text-white font-semibold text-base md:text-lg 
                           rounded-2xl border border-white/15 hover:bg-white/20 active:scale-[0.97] transition-all duration-300"
              >
                <Eye className="w-4 h-4 md:w-5 md:h-5" /> Vakansiyaları kəşf et
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
        >
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Aşağı sürüşdür</span>
          <div className="w-5 h-9 rounded-full border-2 border-white/15 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white/50 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative -mt-14 md:-mt-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-lg !p-6 md:!p-8 rounded-[2rem] grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className={`text-center ${i < stats.length - 1 ? 'md:border-r border-slate-200/60' : ''}`}>
                <div className="text-2xl md:text-4xl font-black text-navy-950 mb-0.5 md:mb-1">{stat.value}</div>
                <div className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-[0.15em]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 mb-5 md:mb-6">
              <Star className="w-3 h-3" /> Niyə StartTap?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-navy-950 mb-3 md:mb-4">
              Bir platformada <span className="text-gradient">hər şey</span>
            </h2>
            <p className="text-base md:text-lg text-slate-800 max-w-xl mx-auto">
              Startaplar, vakansiyalar, komandalar — hamısı bir yerdə.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="card p-6 md:p-8 group cursor-default relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50/60 to-teal-50/60 rounded-bl-[3rem] -z-10" />
                <div className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-5 md:mb-7 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {f.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-navy-950 mb-2 md:mb-3 group-hover:text-emerald-700 transition-colors">{f.title}</h3>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-36 bg-gradient-to-b from-slate-50/80 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/40 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/30 rounded-full blur-[140px] translate-x-1/2 translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-navy-950 mb-5 md:mb-6 leading-tight">
                Azərbaycanın startap ekosistemini{' '}
                <span className="text-gradient">StartTap</span> ilə kəşf edin
              </h2>
              <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-8 md:mb-10 max-w-lg">
                Bizim missiyamız yerli ideyaların qlobal bazara çıxışını asanlaşdırmaq
                və istedadlı mütəxəssisləri düzgün layihələrlə birləşdirməkdir.
              </p>
              <ul className="space-y-4 md:space-y-5">
                {[
                  "Geniş investor şəbəkəsi",
                  "Peşəkar mentor dəstəyi",
                  "İxtisaslaşmış vakansiya bazası"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 md:gap-4 text-sm md:text-base font-semibold text-slate-900"
                  >
                    <div className="w-6 h-6 md:w-7 md:h-7 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative w-full">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/30 via-teal-200/20 to-emerald-200/20 rounded-[3rem] blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
                alt="StartTap Community"
                className="relative rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(5,150,105,0.08)] transition-all duration-700 hover:scale-[1.02] w-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Startups */}
      <section className="py-20 md:py-36 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 md:gap-4 mb-10 md:mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-navy-950 mb-1 md:mb-2">
                Fəal <span className="text-gradient">Startaplar</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-800">Azərbaycanın ən perspektivli layihələrini kəşf edin.</p>
            </div>
            <Link
              to="/startups"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-all group"
            >
              Hamısına bax <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingStartups ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 md:h-60 shimmer" />
              ))}
            </div>
          ) : startups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {startups.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedStartup(s)}
                    className="card p-5 md:p-6 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md">
                        {s.name?.[0] || 'S'}
                      </div>
                      {s.stage && (
                        <span className="badge-emerald text-[10px] uppercase tracking-wider">{s.stage}</span>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-navy-950 mb-0.5 group-hover:text-emerald-700 transition-colors">{s.name}</h3>
                    {s.tagline && (
                      <p className="text-xs font-semibold text-emerald-600 mb-2">{s.tagline}</p>
                    )}

                    <p className="text-xs md:text-sm text-slate-700 line-clamp-2 leading-relaxed mb-3 md:mb-4 min-h-[2rem]">
                      {s.description || 'Təsvir yoxdur'}
                    </p>

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {s.category && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
                            {s.category}
                          </span>
                        )}
                        {s.owner && (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {s.owner.firstname} {s.owner.lastname}
                          </span>
                        )}
                      </div>
                      <div className="w-8 h-8 bg-slate-100 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="card-lg border-dashed border-slate-300 p-12 md:p-20 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 border border-slate-200">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-navy-950 mb-2">Hələ startap yoxdur</h3>
              <p className="text-xs md:text-sm text-slate-600 max-w-xs mx-auto">
                İlk startapı siz yaradın! Dashboard səhifəsindən startapınızı əlavə edə bilərsiniz.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Vacancies */}
      <section className="py-20 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 md:gap-4 mb-10 md:mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-navy-950 mb-1 md:mb-2">
                Ən Son <span className="text-gradient">İmkanlar</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-800">Arzuladığınız iş bir klik uzaqlıqdadır.</p>
            </div>
            <Link
              to="/vacancies"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-all group"
            >
              Hamısına bax <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 md:h-60 shimmer" />
              ))
            ) : (
              vacancies.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedVacancy(v)}
                  className="card p-5 md:p-6 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4 md:mb-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-700 group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:text-emerald-700 transition-all duration-500">
                      {v.startup?.name?.[0] || 'S'}
                    </div>
                    {appliedIds.has(v.id) ? (
                      <span className="badge-amber text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Gözləyir
                      </span>
                    ) : (
                      <span className="badge-green text-[10px] uppercase tracking-wider">Aktiv</span>
                    )}
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-navy-950 mb-0.5 md:mb-1 group-hover:text-emerald-700 transition-colors">{v.title}</h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 md:mb-4">
                    {v.startup?.name || 'Anonim Startap'}
                  </p>

                  <p className="text-xs md:text-sm text-slate-700 line-clamp-2 leading-relaxed mb-4 md:mb-6 min-h-[2rem] md:min-h-[2.5rem]">
                    {v.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-slate-100">
                    <span className="text-base md:text-lg font-bold text-navy-950 flex items-center gap-1">
                      <span className="text-emerald-500">₼</span>
                      {v.salary ? `${v.salary}` : 'Razılaşma'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVacancy(v); }}
                      className="w-9 h-9 md:w-10 md:h-10 bg-slate-100 hover:bg-slate-200 rounded-2xl 
                                 flex items-center justify-center text-slate-600
                                 active:scale-90 transition-all duration-300 mr-1.5"
                      title="Ətraflı bax"
                    >
                      <Eye className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    </button>
                    {appliedIds.has(v.id) ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancelApplication(v.id); }}
                        className="inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 md:py-2.5 bg-amber-50 text-amber-700 
                                   text-xs md:text-sm font-bold rounded-xl hover:bg-amber-100 border border-amber-200/50 
                                   active:scale-90 transition-all"
                      >
                        <X className="w-3.5 h-3.5 md:w-4 md:h-4" /> Ləğv et
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApply(v.id); }}
                        className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-2xl 
                                   flex items-center justify-center text-white
                                   hover:bg-emerald-700 shadow-lg shadow-emerald-500/20
                                   active:scale-90 transition-all duration-300"
                      >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-36 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-20 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-300/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse-glow" style={{ animationDelay: '2s' }} />
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white mb-4 md:mb-6 leading-tight"
              >
                Növbəti böyük ideyanı{' '}
                <span className="text-emerald-200">indi</span>{' '}
                reallaşdır.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-lg text-white/90 max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed"
              >
                Heç bir ödəniş etmədən qeydiyyatdan keçin və Azərbaycanın ən dinamik icmasına qoşulun.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex justify-center gap-3 md:gap-4 flex-wrap"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-emerald-600 text-white font-bold text-base md:text-lg 
                             rounded-2xl hover:bg-emerald-700 active:scale-[0.97] transition-all duration-300
                             shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
                >
                  Hesabını Yarat <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
                <Link
                  to="/vacancies"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-white/20 backdrop-blur-md text-white 
                             font-semibold text-base md:text-lg rounded-2xl border border-white/30 hover:bg-white/30 
                             active:scale-[0.97] transition-all duration-300"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" /> Vakansiyalar
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <DetailModal
        isOpen={!!selectedVacancy}
        onClose={() => setSelectedVacancy(null)}
        vacancy={selectedVacancy}
        applied={selectedVacancy ? appliedIds.has(selectedVacancy.id) : false}
        onApply={handleApply}
        onCancel={handleCancelApplication}
        onViewApplicants={() => navigate('/dashboard')}
      />
      <DetailModal
        isOpen={!!selectedStartup}
        onClose={() => setSelectedStartup(null)}
        startup={selectedStartup}
      />
    </div>
  );
};

export default Home;
