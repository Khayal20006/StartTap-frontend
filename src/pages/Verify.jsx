import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import authService from '../services/authService';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('E-poçt ünvanınız təsdiqlənir...');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Təsdiqləmə kodu tapılmadı.');
        return;
      }
      try {
        await authService.verify(token);
        setStatus('success');
        setMessage('E-poçtunuz uğurla təsdiqləndi!');
        setTimeout(() => navigate('/dashboard'), 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Təsdiqləmə zamanı xəta baş verdi.');
      }
    };
    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-gradient-to-br from-slate-50/80 via-white to-emerald-50/30">
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[150px] -z-10 animate-pulse-glow" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] p-8 md:p-12 text-center max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

        {status === 'loading' && (
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        )}
        {status === 'success' && (
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 transform rotate-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
        )}
        {status === 'error' && (
          <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        )}

        <h2 className="text-3xl font-black tracking-tight text-navy-950 mb-3">
          {status === 'loading' ? 'Təsdiqlənir...' : status === 'success' ? 'Uğurlu!' : 'Xəta baş verdi'}
        </h2>
        <p className="text-base text-slate-700 font-medium mb-10 leading-relaxed">{message}</p>

        {status === 'success' && (
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        )}

        {status === 'error' && (
          <Link to="/login" className="btn-primary !rounded-2xl">
            Giriş səhifəsinə qayıt <ArrowRight className="w-5 h-5" />
          </Link>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          StartTap Ekosistemi
        </div>
      </motion.div>
    </div>
  );
};

export default Verify;
