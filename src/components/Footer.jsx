import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-950 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">StartTap</span>
            </div>
            <p className="text-sm text-slate-200 max-w-sm leading-relaxed font-medium">
              Ideyadan komandaya, komandadan uğura. 
              Azərbaycanın ən dinamik startap ekosisteminə xoş gəlmisiniz.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Platforma</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sm text-slate-200 hover:text-emerald-400 transition-colors font-medium">Startaplar</Link></li>
              <li><Link to="/vacancies" className="text-sm text-slate-200 hover:text-emerald-400 transition-colors font-medium">Vakansiyalar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Şirkət</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-200 hover:text-emerald-400 transition-colors font-medium">Haqqımızda</a></li>
              <li><a href="#" className="text-sm text-slate-200 hover:text-emerald-400 transition-colors font-medium">Əlaqə</a></li>
              <li><a href="#" className="text-sm text-slate-200 hover:text-emerald-400 transition-colors font-medium">Şərtlər</a></li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-navy-800 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-300 font-medium">© 2026 StartTap. Bütün hüquqlar qorunur.</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Ideyadan komandaya, komandadan uğura
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
