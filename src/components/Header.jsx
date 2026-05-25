import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';

const Header = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Kəşf et', path: '/' },
    { name: 'Startaplar', path: '/startups' },
    { name: 'Vakansiyalar', path: '/vacancies' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-ink-200/50 shadow-lg shadow-ink-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="relative flex items-center gap-2 shrink-0 group">
            <span className={`text-xl md:text-2xl font-black tracking-tight leading-none transition-colors duration-300
              ${scrolled ? 'text-ink-900' : 'text-white'}`}>
              Start<span className="text-emerald-400">Tap</span>
            </span>
          </Link>

          <nav className={`hidden md:flex items-center gap-1 ${scrolled ? '' : 'text-white/80'}`}>
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200
                    ${active ? 'text-emerald-400' : scrolled ? 'text-ink-600 hover:text-ink-900' : 'text-white/70 hover:text-white'}`}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="navIndicator"
                      className={`absolute bottom-0 left-3 right-3 h-0.5 ${scrolled ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {user ? (
              <>
                <Link to="/dashboard"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${scrolled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'}`}>
                  <span className="w-6 h-6 bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <button onClick={handleLogout}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-150
                    ${scrolled ? 'text-ink-500 hover:text-red-600 hover:bg-red-50' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors duration-150
                    ${scrolled ? 'text-ink-600 hover:text-ink-900' : 'text-white/70 hover:text-white'}`}>
                  Giriş
                </Link>
                <Link to="/register"
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${scrolled ? 'bg-ink-900 text-white hover:bg-ink-950' : 'bg-white text-ink-900 hover:bg-emerald-50'}`}>
                  Qeydiyyat
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
