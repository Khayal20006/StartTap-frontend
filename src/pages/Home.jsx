import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Users, Briefcase, X, Clock, Rocket, Sparkles, Zap, Target, TrendingUp, Code, Lightbulb, Globe, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { vacancyService, startupService } from '../services/api';
import authService from '../services/authService';
import DetailModal from '../components/DetailModal';
import GradientText from '../components/GradientText';
import Spotlight from '../components/Spotlight';
import ShineButton from '../components/ShineButton';
import NoiseOverlay from '../components/NoiseOverlay';
import GlowCard from '../components/GlowCard';
import Marquee from '../components/Marquee';
import FloatingShapes from '../components/FloatingShapes';
import GrowthChart from '../components/GrowthChart';
import HeroIllustration from '../components/HeroIllustration';

const CountUp = ({ end, duration = 1.5, suffix = '' }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let startTime;
      const animate = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / (duration * 1000), 1);
        setCount(Math.floor(end * progress));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [rocketExiting, setRocketExiting] = useState(false);
  const [rocketPos, setRocketPos] = useState(null);
  const rocketRef = useRef(null);
  const user = authService.getCurrentUser();
  const [notification, setNotification] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const createNotification = (title, message, type = 'success') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try { const res = await vacancyService.getAll(); setVacancies(res.data.slice(0, 6)); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    const fetchStartups = async () => {
      try { const res = await startupService.getAll(); setStartups(res.data); }
      catch (err) { console.error(err); }
      finally { setLoadingStartups(false); }
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

  useEffect(() => {
    if (user || rocketExiting) return;
    const el = rocketRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const rect = el.getBoundingClientRect();
      setRocketPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width, h: rect.height });
      setRocketExiting(true);
      setTimeout(() => navigate('/login'), 1500);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [user, navigate, rocketExiting]);

  const handleApply = async (vacancyId) => {
    const user = authService.getCurrentUser();
    if (!user) { createNotification('Giriş lazımdır', 'Müraciət üçün giriş edin.', 'error'); return; }
    try {
      await vacancyService.apply(vacancyId);
      setAppliedIds(prev => new Set([...prev, vacancyId]));
      createNotification('Uğurlu!', 'Müraciətiniz komandaya göndərildi.');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('Artıq') || msg.includes('already') || msg.includes('mövcuddur')) {
        setAppliedIds(prev => new Set([...prev, vacancyId]));
        createNotification('Artıq müraciət edilib', '', 'error');
      } else {
        createNotification('Xəta', typeof msg === 'string' && msg ? msg : 'Müraciət mümkün olmadı.', 'error');
      }
    }
  };

  const handleCancelApplication = async (vacancyId) => {
    try {
      await vacancyService.cancelApplication(vacancyId);
      setAppliedIds(prev => { const n = new Set(prev); n.delete(vacancyId); return n; });
      createNotification('Ləğv edildi', 'Müraciətiniz geri götürüldü.');
    } catch (err) {
      createNotification('Xəta', err.response?.data?.message || 'Ləğv mümkün olmadı.', 'error');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-gradient-to-br from-emerald-950 via-[#0a2e2a] to-teal-950 overflow-hidden">
        <NoiseOverlay />
        <Spotlight />
        <FloatingShapes count={10} />

        {/* Gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-300/10 rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <motion.div style={{ y: heroY }} className="relative z-10 w-full">
          <div className="page-container">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pt-28 md:pt-36 pb-16 md:pb-20">
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 md:mb-8">
                    <Sparkles className="w-3 h-3 text-emerald-300" />
                    <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-[0.2em]">
                      Azərbaycanın Startap Ekosistemi
                    </span>
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[1.02] mb-4 md:mb-6"
                >
                  <span className="block">Gələcəyi</span>
                  <GradientText as="span" className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                    birlikdə quraq
                  </GradientText>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-sm md:text-base lg:text-lg text-emerald-100/60 max-w-2xl mx-auto lg:mx-0 mb-10 md:mb-12 font-light leading-relaxed"
                >
                  İdeyalarınızı reallığa çevirmək üçün lazım olan hər şey — komanda, investor, alətlər — bir platformada.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex flex-col sm:flex-row items-center lg:justify-start gap-4"
                >
                  <Link to="/register"
                    className="group relative inline-flex items-center gap-2 px-8 md:px-10 py-4 bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider overflow-hidden
                      shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:-translate-y-0.5 transition-all duration-200">
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10 flex items-center gap-2">
                      İndi başla <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link to="/vacancies"
                    className="inline-flex items-center gap-2 px-8 md:px-10 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-sm uppercase tracking-wider border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200">
                    Vakansiyaları kəşf et
                  </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex items-center justify-center lg:justify-start gap-6 md:gap-10 mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/10"
                >
                  {[
                    { icon: Users, text: '10k+ İstifadəçi' },
                    { icon: Briefcase, text: '2.5k+ Vakansiya' },
                    { icon: Rocket, text: '500+ Startap' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 text-emerald-100/50 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        {item.text}
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              <motion.div
                className="w-full max-w-[320px] md:max-w-[420px] lg:max-w-[500px] shrink-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <HeroIllustration />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-emerald-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="relative py-5 md:py-6 bg-ink-950 border-y border-emerald-900/30 overflow-hidden">
        <Marquee
          items={[
            'Startap Ekosistemi', '•', 'İnnovasiya', '•', 'İnvestisiya', '•', 'Komanda', '•',
            'Sürət', '•', 'Böyümə', '•', 'Texnologiya', '•', 'Gələcək', '•',
            'Startap Ekosistemi', '•', 'İnnovasiya', '•', 'İnvestisiya', '•',
          ]}
          speed={40}
        />
      </div>

      {/* Stats */}
      <section className="relative -mt-10 md:-mt-16 z-20">
        <div className="page-container">
          <div className="relative bg-white/95 backdrop-blur-sm border border-ink-200 shadow-2xl shadow-emerald-900/10 p-8 md:p-12 lg:p-16">
            {/* Decorative corner accent */}
            <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <div className="absolute top-0 left-0 w-1 h-16 bg-gradient-to-b from-emerald-500 to-emerald-400" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { label: 'Startap', value: 500, suffix: '+', icon: Rocket },
                { label: 'İstifadəçi', value: 10, suffix: 'k+', icon: Users },
                { label: 'Vakansiya', value: 2500, suffix: '+', icon: Briefcase },
                { label: 'Yatırım', value: 2, suffix: 'M+ ₼', icon: Sparkles },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mx-auto mb-3 md:mb-4 border border-emerald-200/50 group-hover:border-emerald-300 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <div className="text-2xl md:text-3xl lg:text-5xl font-black text-gradient-emerald">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] md:text-xs font-bold text-ink-500 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 to-transparent" />
        <FloatingShapes count={4} className="opacity-20" />
        <div className="page-container relative z-10">
          <div className="text-center mb-14 md:mb-20">
            <div className="section-label">Niyə StartTap?</div>
            <h2 className="section-title mt-3 mb-4">
              Ekosistemin <GradientText>üstünlükləri</GradientText>
            </h2>
            <p className="section-sub max-w-xl mx-auto">
              Startaplar və istedadlar üçün hər şey bir yerdə.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'İldırım Sürəti', desc: 'Profilinizi saniyələr içində yaradın. AI dəstəkli matching ilə dərhal kəşf etməyə başlayın.', icon: Zap, accent: 'from-amber-400 to-orange-500' },
              { title: 'Peşəkar Komanda', desc: 'Yüksək ixtisaslı mütəxəssisləri tapın, komandanızı qurun və birlikdə böyüyün.', icon: Target, accent: 'from-blue-400 to-indigo-500' },
              { title: 'Limitsiz İnkişaf', desc: 'Startapınızı böyütmək üçün investor şəbəkəsi, mentorluq və biznes alətlər.', icon: TrendingUp, accent: 'from-emerald-400 to-teal-500' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <GlowCard key={i}>
                  <div className="relative card p-8 md:p-10 lg:p-12 text-center h-full overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mx-auto mb-5 md:mb-6 border border-emerald-200/50 group-hover:border-emerald-300/50 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-ink-900 uppercase tracking-tight mb-3 md:mb-4">{f.title}</h3>
                    <p className="text-sm md:text-base text-ink-500 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem Trust */}
      <section className="py-16 md:py-20 bg-ink-900 relative overflow-hidden">
        <NoiseOverlay className="opacity-[0.03]" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="section-label text-emerald-400">Ekosistem</div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mt-3 mb-4 leading-tight">
                Böyüyən startap <GradientText>ekosisteminə</GradientText> qoşul
              </h2>
              <p className="text-base md:text-lg text-ink-400 max-w-md leading-relaxed mb-8">
                Startaplar, investorlar və istedadlar bir araya gələrək Azərbaycanın ən sürətli böyüyən innovasiya mərkəzini yaradır.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'İllik artım', value: '240%' },
                  { label: 'Aktiv startap', value: '50+' },
                  { label: 'Yeni iş yeri', value: '1000+' },
                  { label: 'İnvestisiya', value: '₼2M+' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-emerald-600/50 pl-4">
                    <div className="text-xl md:text-2xl font-black text-gradient-emerald">{item.value}</div>
                    <div className="text-[10px] md:text-xs text-ink-500 font-bold uppercase tracking-wider mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-emerald-900/30 p-6 md:p-8 lg:p-10">
              <GrowthChart className="w-full h-48 md:h-56 lg:h-64" />
            </div>
          </div>
        </div>
      </section>

      {/* Active Startups */}
      <section className="py-20 md:py-24 lg:py-28 bg-ink-50 relative overflow-hidden">
        <div className="page-container relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="section-label">Startaplar</div>
              <h2 className="section-title mt-2">Fəal Startaplar</h2>
              <p className="section-sub mt-1">Ən perspektivli layihələri kəşf edin.</p>
            </div>
            <Link to="/startups" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-600 hover:text-emerald-600 transition-colors duration-150">
              Hamısına bax <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingStartups ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 shimmer" />)}
            </div>
          ) : startups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.slice(0, 3).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <GlowCard onClick={() => setSelectedStartup(s)}>
                    <div className="card p-6 md:p-8 cursor-pointer">
                      <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-600/20">
                          {s.name?.[0] || 'S'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-ink-900 truncate text-base md:text-lg">{s.name}</h3>
                          {s.stage && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{s.stage}</span>}
                        </div>
                      </div>
                      <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed font-medium">{s.description || 'Təsvir yoxdur'}</p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-ink-400 font-semibold">Hələ startap yoxdur.</div>
          )}
        </div>
      </section>

      {/* Latest Vacancies */}
      <section className="py-20 md:py-24 lg:py-28 relative overflow-hidden">
        <FloatingShapes count={4} className="opacity-15" />
        <div className="page-container relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="section-label">Vakansiyalar</div>
              <h2 className="section-title mt-2">Ən Son İmkanlar</h2>
              <p className="section-sub mt-1">Arzuladığınız iş bir klik uzaqlıqdadır.</p>
            </div>
            <Link to="/vacancies" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-600 hover:text-emerald-600 transition-colors duration-150">
              Hamısına bax <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-52 shimmer" />)
            ) : (
              vacancies.slice(0, 3).map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <GlowCard onClick={() => setSelectedVacancy(v)}>
                    <div className="card p-6 md:p-8 cursor-pointer">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-ink-900 text-base md:text-lg">{v.title}</h3>
                        {appliedIds.has(v.id) ? (
                          <span className="badge-amber text-[10px] flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" /> Gözləyir
                          </span>
                        ) : (
                          <span className="badge-emerald text-[10px] shrink-0">Aktiv</span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">{v.startup?.name || 'Anonim'}</p>
                      <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed font-medium mb-4">{v.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-ink-100">
                        <span className="text-sm font-black text-ink-900">{v.salary ? `${v.salary} ₼` : 'Razılaşma'}</span>
                        {appliedIds.has(v.id) ? (
                          <button onClick={(e) => { e.stopPropagation(); handleCancelApplication(v.id); }}
                            className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors duration-150">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleApply(v.id); }}
                            className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all duration-150">
                            Müraciət et
                          </button>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-28 lg:py-36 bg-ink-900 overflow-hidden">
        <NoiseOverlay className="opacity-[0.02]" />
        <FloatingShapes count={8} className="opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 to-transparent" />

        <div className="page-container text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div ref={rocketRef}
              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 md:mb-8"
            >
              <Rocket className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.05]">
              Növbəti böyük ideyanı<br />
              <GradientText>indi reallaşdır.</GradientText>
            </h2>
            <p className="text-base md:text-lg text-ink-400 mb-10 md:mb-12 font-light max-w-lg mx-auto">
              Heç bir ödəniş etmədən qeydiyyatdan keçin. Ekosistemə qoşulun, ideyanızı böyüdün.
            </p>
            <Link to="/register"
              className="group relative inline-flex items-center gap-2 px-10 md:px-12 py-4 md:py-5 bg-white text-ink-900 font-bold text-sm uppercase tracking-wider overflow-hidden
                shadow-2xl shadow-white/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                Hesabını Yarat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
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

      {!user && rocketExiting && rocketPos && (
        <div className="fixed inset-0 z-[300] pointer-events-none">
          <motion.div
            className="absolute"
            style={{
              left: rocketPos.x - rocketPos.w / 2,
              top: rocketPos.y - rocketPos.h / 2,
              width: rocketPos.w,
              height: rocketPos.h,
            }}
            animate={{
              y: -(rocketPos.y + window.innerHeight),
              x: 0,
              opacity: [1, 1, 0],
              scale: [1, 0.8, 0.3],
            }}
            transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white"
          >
            <Rocket className="w-7 h-7 md:w-8 md:h-8" />
          </motion.div>

          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * 360;
            const dist = 80 + Math.random() * 200;
            const size = 3 + Math.random() * 6;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: rocketPos.x - size / 2,
                  top: rocketPos.y - size / 2,
                  width: size,
                  height: size,
                  backgroundColor: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#fbbf24', '#f59e0b'][i % 6],
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * dist,
                  y: Math.sin((angle * Math.PI) / 180) * dist - 100,
                  opacity: [1, 0.8, 0],
                  scale: [1, 2, 0],
                }}
                transition={{ duration: 0.8 + Math.random() * 0.6, delay: Math.random() * 0.2, ease: 'easeOut' }}
              />
            );
          })}

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-white/80 text-sm md:text-base font-medium tracking-wide">
              Kosmosa qalxmaq üçün
            </p>
            <p className="text-emerald-400 text-2xl md:text-4xl font-black tracking-tight mt-2">
              Giriş edin
            </p>
            <motion.div
              className="mt-4 md:mt-6 w-6 h-6 border-2 border-emerald-400/60 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-ink-950 via-emerald-950/50 to-ink-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      )}

      {notification && (
        <div
          className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 px-4 py-3 border shadow-xl max-w-xs"
          style={{
            backgroundColor: notification?.type === 'error' ? '#fef2f2' : '#ecfdf5',
            borderColor: notification?.type === 'error' ? '#fecaca' : '#a7f3d0',
            color: notification?.type === 'error' ? '#991b1b' : '#065f46',
          }}
        >
          <p className="text-xs font-bold">{notification?.title}</p>
          <p className="text-[10px] mt-0.5 opacity-80">{notification?.message}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
