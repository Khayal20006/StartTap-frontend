import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-ink-950 border-t border-ink-800">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-black text-white tracking-tight">StartTap</Link>
            <p className="text-sm text-ink-400 max-w-sm leading-relaxed mt-3 font-medium">
              Ideyadan komandaya, komandadan uğura. 
              Azərbaycanın ən dinamik startap ekosisteminə xoş gəlmisiniz.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-4">Platforma</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sm text-ink-300 hover:text-emerald-400 transition-colors duration-150 font-medium">Startaplar</Link></li>
              <li><Link to="/vacancies" className="text-sm text-ink-300 hover:text-emerald-400 transition-colors duration-150 font-medium">Vakansiyalar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-4">Şirkət</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-ink-300 hover:text-emerald-400 transition-colors duration-150 font-medium">Haqqımızda</a></li>
              <li><a href="#" className="text-sm text-ink-300 hover:text-emerald-400 transition-colors duration-150 font-medium">Əlaqə</a></li>
              <li><a href="#" className="text-sm text-ink-300 hover:text-emerald-400 transition-colors duration-150 font-medium">Şərtlər</a></li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-ink-800 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-500 font-medium">© 2026 StartTap. Bütün hüquqlar qorunur.</p>
          <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider">
            Ideyadan komandaya, komandadan uğura
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
