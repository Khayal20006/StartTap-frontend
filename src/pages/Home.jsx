import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ArrowRight, Users, Briefcase, Eye, X, Clock, Sparkles, Rocket, Lightbulb, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { vacancyService, startupService } from '../services/api';
import authService from '../services/authService';
import DetailModal from '../components/DetailModal';

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const card3D = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const Home = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [startups, setStartups] = useState([]);
  const [vacancyCount, setVacancyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [notification, setNotification] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const ecoRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 250]);

  const { scrollYProgress: ecoProgress } = useScroll({
    target: ecoRef,
    offset: ['start end', 'center center'],
  });
  const clipReveal = useTransform(ecoProgress, [0, 1], [100, 0]);

  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ['start end', 'end start'],
  });
  const ctaScale = useTransform(ctaProgress, [0, 1], [1.1, 1]);
  const ctaY = useTransform(ctaProgress, [0, 1], [-80, 80]);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const heroParallax = {
    x: mousePos.x * -20,
    y: mousePos.y * -20,
  };

  const createNotification = (title, message, type = 'success') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await vacancyService.getAll();
        setVacancyCount(res.data.length);
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

    const user = authService.getCurrentUser();
    if (user) {
      vacancyService.getMyApplications()
        .then(res => setAppliedIds(new Set(res.data.filter(a => a.status !== 'CANCELED').map(a => a.jobId))))
        .catch(() => {});
    }
  }, []);

  const handleApply = async (vacancyId) => {
    const user = authService.getCurrentUser();
    if (!user) {
      createNotification('Giriş lazımdır', 'Müraciət üçün əvvəlcə giriş etməlisiniz.', 'error');
      return;
    }
    try {
      await vacancyService.apply(vacancyId);
      setAppliedIds(prev => new Set([...prev, vacancyId]));
      createNotification('Uğurlu müraciət!', 'Müraciətiniz komandaya göndərildi.');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('Artıq') || msg.includes('already') || msg.includes('mövcuddur')) {
        setAppliedIds(prev => new Set([...prev, vacancyId]));
        createNotification('Artıq müraciət edilib', 'Bu vakansiyaya əvvəlcədən müraciət etmisiniz.', 'error');
      } else {
        createNotification('Xəta', typeof msg === 'string' && msg ? msg : 'Müraciət mümkün olmadı.', 'error');
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
      createNotification('Ləğv edildi', 'Müraciətiniz geri götürüldü.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Müraciəti ləğv etmək mümkün olmadı.';
      createNotification('Xəta', msg, 'error');
    }
  };

  return (
    <div className="min-h-screen pb-16 relative overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: heroParallax.x, y: heroParallax.y }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/85 to-teal-950/90" />
        </motion.div>

        <div className="absolute top-[8%] left-[3%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[180px] animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-teal-300/8 rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[30%] w-[400px] h-[400px] bg-emerald-300/6 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-6 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-[11px] md:text-xs font-bold text-emerald-100 tracking-wider uppercase">Azərbaycanın Startap Ekosistemi</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-4 md:mb-6 overflow-hidden">
              <motion.span
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Gələcəyi
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient-light"
              >
                birlikdə quraq
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg lg:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-8 md:mb-10 font-medium leading-relaxed"
            >
              StartTap — İdeyalarınızı reallığa çevirmək üçün lazım olan hər şeyi bir araya gətirir.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
            >
              <Link to="/register" className="btn-primary !rounded-2xl !px-8 !py-4 text-base !shadow-[0_8px_30px_rgba(5,150,105,0.35)] hover:!shadow-[0_12px_40px_rgba(5,150,105,0.5)]">
                İndi başla <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/vacancies" className="btn-outline-light !rounded-2xl !px-8 !py-4 text-base">
                Vakansiyaları kəşf et
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 md:-mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-[2rem] p-6 md:p-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { label: 'Startap', value: startups.length || 0, icon: Rocket },
                { label: 'İstifadəçi', value: '10k+', icon: Users },
                { label: 'Vakansiya', value: vacancyCount || 0, icon: Briefcase },
                { label: 'Yatırım', value: '₼2M+', icon: Shield },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    className="text-center group"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-500 shadow-sm">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <div className="text-2xl md:text-4xl font-black text-navy-950">{stat.value}</div>
                    <div className="text-xs md:text-sm font-semibold text-slate-500 mt-0.5">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-18"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="badge-emerald mb-4 inline-block"
            >
              Niyə StartTap?
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-navy-950 mb-3">
              Ekosistemimizin üstünlükləri
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto font-medium">
              Startaplar və istedadlar üçün hər şey bir yerdə.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              { title: 'İldırım Sürəti', desc: 'Profilinizi saniyələr içində yaradın və dərhal kəşf etməyə başlayın.', icon: Rocket },
              { title: 'Peşəkar Komanda', desc: 'Yüksək ixtisaslı mütəxəssisləri tapın və komandanızı gücləndirin.', icon: Users },
              { title: 'Limitsiz İnkişaf', desc: 'Startapınızı böyütmək üçün lazım olan alətlər və dəstək.', icon: Lightbulb },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="glass-card rounded-2xl p-8 md:p-10 text-center group cursor-default relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="relative">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-navy-950 mb-2 md:mb-3">{f.title}</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            ref={ecoRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="card-lg mt-12 md:mt-16 overflow-hidden relative bg-white border-emerald-100/60"
          >
            <div className="absolute inset-0">
              <motion.img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80"
                alt=""
                className="w-full h-full object-cover"
                style={{ clipPath: useTransform(clipReveal, (v) => `inset(0 ${v}% 0 0)`) }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  className="badge-emerald mb-3 inline-block"
                >
                  Ekosistem
                </motion.span>
                <h2 className="text-2xl md:text-4xl font-black text-navy-950 mb-3 md:mb-4">StartTap ekosistemini kəşf edin</h2>
                <p className="text-sm md:text-base text-slate-600 mb-5 md:mb-6 font-medium">Bizim missiyamız yerli ideyaların qlobal bazara çıxışını asanlaşdırmaqdır.</p>
                <ul className="space-y-3">
                  {['Geniş investor şəbəkəsi', 'Peşəkar mentor dəstəyi', 'İxtisaslaşmış vakansiya bazası'].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3 text-sm font-semibold text-navy-800"
                    >
                      <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 md:p-10 text-center border border-emerald-100/40 backdrop-blur-sm"
                >
                  <Rocket className="w-16 h-16 md:w-20 md:h-20 text-emerald-600 mx-auto mb-4 animate-float" />
                  <p className="text-base md:text-lg font-bold text-emerald-900">Azərbaycanın ən sürətli böyüyən startap icması</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Startups */}
      <section className="py-16 md:py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14"
          >
            <div>
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="badge-emerald mb-3 inline-block"
              >
                Startaplar
              </motion.span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-navy-950">Fəal Startaplar</h2>
              <p className="text-sm md:text-base text-slate-600 font-medium mt-1">Ən perspektivli layihələri kəşf edin.</p>
            </div>
            <Link to="/startups" className="btn-ghost text-sm font-bold group">
              Hamısına bax <ArrowRight className="w-4 h-4 inline group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {loadingStartups ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-44 shimmer" />)}
            </div>
          ) : startups.length > 0 ? (
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {startups.slice(0, 3).map(s => (
                <motion.div
                  key={s.id}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedStartup(s)}
                  className="card p-6 md:p-8 cursor-pointer group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {s.name?.[0] || 'S'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-navy-950 truncate">{s.name}</h3>
                      {s.stage && <span className="badge-emerald text-[10px]">{s.stage}</span>}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{s.description || 'Təsvir yoxdur'}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 text-slate-500 font-semibold">Hələ startap yoxdur.</div>
          )}
        </div>
      </section>

      {/* Latest Vacancies */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14"
          >
            <div>
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="badge-emerald mb-3 inline-block"
              >
                Vakansiyalar
              </motion.span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-navy-950">Ən Son İmkanlar</h2>
              <p className="text-sm md:text-base text-slate-600 font-medium mt-1">Arzuladığınız iş bir klik uzaqlıqdadır.</p>
            </div>
            <Link to="/vacancies" className="btn-ghost text-sm font-bold group">
              Hamısına bax <ArrowRight className="w-4 h-4 inline group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-44 shimmer rounded-2xl" />)
            ) : (
              vacancies.slice(0, 3).map(v => (
                <motion.div
                  key={v.id}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedVacancy(v)}
                  className="card p-6 md:p-8 cursor-pointer group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute top-0 left-0 w-20 h-20 bg-emerald-500/5 rounded-br-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-navy-950">{v.title}</h3>
                    {appliedIds.has(v.id) ? (
                      <span className="badge-amber text-[10px] flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> Gözləyir
                      </span>
                    ) : (
                      <span className="badge-emerald text-[10px] shrink-0">Aktiv</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-emerald-600 mb-2">{v.startup?.name || 'Anonim'}</p>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">{v.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-black text-navy-950">{v.salary ? `${v.salary} ₼` : 'Razılaşma'}</span>
                    {appliedIds.has(v.id) ? (
                      <button onClick={(e) => { e.stopPropagation(); handleCancelApplication(v.id); }} className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl hover:bg-amber-100 active:scale-95 transition-all">
                        <X className="w-3 h-3" /> Ləğv et
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleApply(v.id); }} className="inline-flex items-center gap-1 px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-500/15">
                        Müraciət et
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="relative py-20 md:py-28 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: ctaScale, y: ctaY }}
        >
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/90 via-emerald-600/85 to-teal-700/90" />
        </motion.div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-300/12 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Rocket className="w-12 h-12 md:w-16 md:h-16 text-emerald-200 mx-auto mb-6 md:mb-8 animate-float" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3 md:mb-4">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="block"
              >
                Növbəti böyük ideyanı
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="block text-gradient-light"
              >
                indi reallaşdır.
              </motion.span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-base md:text-lg text-emerald-100/80 mb-8 md:mb-10 font-medium"
            >
              Heç bir ödəniş etmədən qeydiyyatdan keçin.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              <Link to="/register" className="btn-primary !rounded-2xl !px-10 !py-4 md:!py-5 text-base md:text-lg !bg-white !text-emerald-800 hover:!bg-emerald-50 !shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:!shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
                Hesabını Yarat <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
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

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl border max-w-sm backdrop-blur-xl ${
            notification.type === 'error'
              ? 'bg-red-50/90 border-red-200/80 text-red-800'
              : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-800'
          }`}
        >
          <p className="text-sm font-bold">{notification.title}</p>
          {notification.message && <p className="text-xs mt-0.5 opacity-80">{notification.message}</p>}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
