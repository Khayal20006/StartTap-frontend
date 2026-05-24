import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import authService from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'E-poçt və ya şifrə yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-gradient-to-br from-slate-50/80 via-white to-emerald-50/30">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[150px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-200/15 rounded-full blur-[130px] -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-50/80 to-transparent rounded-bl-[3rem] -z-10" />
          <div className="text-center mb-8 md:mb-10">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 shadow-lg shadow-navy-900/10 transform -rotate-3 hover:rotate-0 transition-transform">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-navy-950 mb-1">Xoş gəlmisiniz</h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium">Davam etmək üçün hesabınıza daxil olun.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 text-sm font-bold p-3.5 md:p-4 rounded-2xl border border-red-100 mb-5 md:mb-6 flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-red-600 rounded-full shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 mb-1.5 block">E-poçt</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email" required placeholder="nümunə@mail.com"
                  className="input-field !pl-10 md:!pl-12"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 mb-1.5 block">Şifrə</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password" required placeholder="••••••••"
                  className="input-field !pl-10 md:!pl-12"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <button disabled={loading} className="btn-primary w-full !py-3.5 md:!py-4 !rounded-2xl mt-1 md:mt-2">
              {loading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : (
                <>Daxil ol <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-100 text-center">
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              Hesabınız yoxdur?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors underline decoration-2 underline-offset-2 decoration-emerald-200 hover:decoration-emerald-400">
                Qeydiyyatdan keçin
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
