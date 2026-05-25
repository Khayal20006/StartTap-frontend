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
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-ink-200 p-8 md:p-12 text-center max-w-md"
      >
        {status === 'loading' && (
          <div className="w-20 h-20 bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        )}
        {status === 'success' && (
          <div className="w-20 h-20 bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
        )}
        {status === 'error' && (
          <div className="w-20 h-20 bg-red-50 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        )}

        <h2 className="text-3xl font-black tracking-tight text-ink-900 mb-3">
          {status === 'loading' ? 'Təsdiqlənir...' : status === 'success' ? 'Uğurlu!' : 'Xəta baş verdi'}
        </h2>
        <p className="text-base text-slate-700 font-medium mb-10 leading-relaxed">{message}</p>

        {status === 'success' && (
          <div className="w-full h-1.5 bg-slate-100 overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="h-full bg-emerald-500"
            />
          </div>
        )}

        {status === 'error' && (
          <Link to="/login" className="btn-primary">
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
