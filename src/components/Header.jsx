import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronRight, Rocket } from 'lucide-react';
import authService from '../services/authService';

const Header = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Kəşf et', path: '/' },
    { name: 'Startaplar', path: '/startups' },
    { name: 'Vakansiyalar', path: '/vacancies' },
  ];

  const userInitial = user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 md:gap-3 group shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:bg-emerald-700 transition-all duration-300">
              <Rocket className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight text-black leading-none">
                StartTap
              </span>
              <span className="hidden sm:block text-[9px] md:text-[10px] font-bold text-emerald-600 tracking-[0.15em] uppercase mt-0.5">
                Ideyadan komandaya
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-800 hover:text-black hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 md:py-2 bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {userInitial}
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-xs font-bold text-white leading-none block">Dashboard</span>
                    <span className="text-[9px] font-semibold text-emerald-100 mt-0.5 uppercase tracking-wider">Mənim hesabım</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  title="Çıxış"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-800 hover:text-black px-3 md:px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
                >
                  Giriş
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition-all duration-200"
                >
                  <span className="hidden sm:inline">Qeydiyyat</span>
                  <span className="sm:hidden">Qeyd.</span>
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
