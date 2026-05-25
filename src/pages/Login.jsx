import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import authService from '../services/authService';
import AnimatedBackground from '../components/AnimatedBackground';
import NetworkGraph from '../components/NetworkGraph';
import NoiseOverlay from '../components/NoiseOverlay';
import Spotlight from '../components/Spotlight';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-950 to-emerald-950">
      <AnimatedBackground />
      <div className="absolute inset-0 opacity-[0.03]">
        <NetworkGraph />
      </div>
      <NoiseOverlay />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
      >
        <Spotlight />
        <div className="card-dark-glass border border-white/10 p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8 md:mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-14 h-14 bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-5 md:mb-6 border border-white/10"
              >
                <svg className="w-8 h-8 md:w-9 md:h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1"
              >
                Xoş gəlmisiniz
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xs md:text-sm text-emerald-100/70 font-medium"
              >
                Davam etmək üçün hesabınıza daxil olun.
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                className="bg-red-500/10 text-red-300 text-sm font-bold p-3.5 md:p-4 border border-red-500/20 mb-5 md:mb-6 flex items-center gap-3 overflow-hidden backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-red-400 shrink-0 animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="text-[10px] md:text-xs font-bold text-emerald-200/70 uppercase tracking-wider ml-1 mb-1.5 block">E-poçt</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors duration-150" />
                  <input
                    type="email" required placeholder="nümunə@mail.com"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 md:py-3.5 pl-10 md:pl-12 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all duration-150"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-bold text-emerald-200/70 uppercase tracking-wider ml-1 mb-1.5 block">Şifrə</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors duration-150" />
                  <input
                    type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 md:py-3.5 pl-10 md:pl-12 pr-10 md:pr-12 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all duration-150"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 md:right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 md:w-4.5 md:h-4.5" /> : <Eye className="w-4 h-4 md:w-4.5 md:h-4.5" />}
                  </button>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="btn-primary-glow w-full !py-3.5 md:!py-4 mt-1 md:mt-2 text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : (
                  <>Daxil ol <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>
                )}
              </motion.button>
            </form>

            <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/5 text-center">
              <p className="text-xs md:text-sm text-emerald-100/60 font-medium">
                Hesabınız yoxdur?{' '}
                <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-2 underline-offset-2 decoration-emerald-500/30 hover:decoration-emerald-400/60">
                  Qeydiyyatdan keçin
                </Link>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
              <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              StartTap Ekosistemi
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
