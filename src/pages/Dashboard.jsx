import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, LayoutGrid, Briefcase, User, Rocket, ExternalLink, Edit3,
  Sparkles, Mail, Upload, FileText, X, Phone, Github, Linkedin,
  Clock, CheckCircle, XCircle, AlertCircle, Eye, Send,
  DollarSign
} from 'lucide-react';
import { startupService, vacancyService, profileService, fileService } from '../services/api';
import authService from '../services/authService';

const CATEGORIES = ['SAAS', 'FINTECH'];
const STAGES = ['IDEA', 'PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B_PLUS'];

const Dashboard = () => {
  const [startups, setStartups] = useState([]);
  const [userVacancies, setUserVacancies] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'startups');

  const [isStartupModalOpen, setIsStartupModalOpen] = useState(false);
  const [isVacancyModalOpen, setIsVacancyModalOpen] = useState(false);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const [startupForm, setStartupForm] = useState({ name: '', description: '', tagline: '', category: 'SAAS', stage: 'IDEA', website: '' });
  const [vacancyForm, setVacancyForm] = useState({ title: '', description: '', salary: '', startupId: '' });
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', username: '', phoneNumber: '', linkedinUrl: '', githubUrl: '' });

  const user = authService.getCurrentUser();

  const [toastMessage, setToastMessage] = useState({ title: '', sub: '', type: 'success' });
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (title, sub, type = 'success') => {
    setToastMessage({ title, sub, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleDeleteStartup = async (id, name) => {
    if (!confirm(`"${name}" startapını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) return;
    try {
      await startupService.delete(id);
      triggerToast('Silindi', `"${name}" startapı silindi.`);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Silinmə mümkün olmadı.';
      triggerToast('Xəta', typeof msg === 'string' ? msg : 'Silinmə mümkün olmadı.', 'error');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startupsRes, profileRes, cvRes] = await Promise.all([
        startupService.getMyStartups(),
        profileService.getMe(),
        fileService.getMyCv().catch(() => ({ data: null }))
      ]);
      setStartups(startupsRes.data);
      setProfile(profileRes.data);
      setCv(cvRes.data);

      const myAppsRes = await vacancyService.getMyApplications();
      setMyApplications(myAppsRes.data);

      const allVacancies = [];
      for (const startup of startupsRes.data) {
        const vRes = await vacancyService.getByStartupId(startup.id);
        allVacancies.push(...vRes.data.map(v => ({ ...v, startupName: startup.name, startupId: startup.id })));
      }
      setUserVacancies(allVacancies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Xəta', 'Fayl ölçüsü 5MB-dan çox ola bilməz.', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await fileService.upload(file);
      setCv(res.data);
      triggerToast('Uğurlu', 'CV sistemə yükləndi.');
    } catch (err) {
      triggerToast('Xəta', 'Fayl yüklənərkən problem yarandı.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCv = async () => {
    if (!cv) return;
    if (!confirm('CV-ni silmək istədiyinizə əminsiniz?')) return;
    try {
      await fileService.delete(cv.publicId);
      setCv(null);
      triggerToast('Silindi', 'CV uğurla silindi.');
    } catch (err) {
      triggerToast('Xəta', 'CV silinərkən problem baş verdi.', 'error');
    }
  };

  const handlePreviewCv = async () => {
    try {
      const res = await fileService.previewCv();
      window.open(URL.createObjectURL(res.data), '_blank');
    } catch (err) {
      triggerToast('Xəta', 'CV önizləməsi mümkün olmadı.', 'error');
    }
  };

  const handleStartupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await startupService.update(selectedItem.id, startupForm);
        triggerToast('Uğurlu', 'Startap yeniləndi.');
      } else {
        await startupService.create(startupForm);
        triggerToast('Uğurlu', 'Yeni startap yaradıldı!');
      }
      setIsStartupModalOpen(false);
      fetchData();
    } catch (err) {
      triggerToast('Xəta', 'Yadda saxlamaq mümkün olmadı.', 'error');
    }
  };

  const handleVacancySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await vacancyService.update(selectedItem.id, vacancyForm);
        triggerToast('Uğurlu', 'Vakansiya yeniləndi.');
      } else {
        await vacancyService.create(vacancyForm);
        triggerToast('Uğurlu', 'Vakansiya dərc edildi!');
      }
      setIsVacancyModalOpen(false);
      fetchData();
    } catch (err) {
      triggerToast('Xəta', 'Yadda saxlamaq mümkün olmadı.', 'error');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await profileService.updateMe(profileForm);
      setProfile(res.data);
      triggerToast('Uğurlu', 'Profil yeniləndi.');
      setIsProfileModalOpen(false);
      const curr = authService.getCurrentUser();
      if (curr) localStorage.setItem('user', JSON.stringify({ ...curr, ...res.data }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Yeniləmə mümkün olmadı.';
      triggerToast('Xəta', typeof msg === 'string' ? msg : 'Yeniləmə mümkün olmadı.', 'error');
    }
  };

  const openStartupModal = (startup = null) => {
    if (startup) {
      setStartupForm({ name: startup.name, description: startup.description, tagline: startup.tagline || '', category: startup.category || 'SAAS', stage: startup.stage || 'IDEA', website: startup.website || '' });
      setSelectedItem(startup);
      setIsEditMode(true);
    } else {
      setStartupForm({ name: '', description: '', tagline: '', category: 'SAAS', stage: 'IDEA', website: '' });
      setIsEditMode(false);
    }
    setIsStartupModalOpen(true);
  };

  const openVacancyModal = (vacancy = null, startupId = null) => {
    if (vacancy) {
      setVacancyForm({ title: vacancy.title, description: vacancy.description, salary: vacancy.salary || '', startupId: vacancy.startupId || vacancy.startup?.id || '' });
      setSelectedItem(vacancy);
      setIsEditMode(true);
    } else {
      setVacancyForm({ title: '', description: '', salary: '', startupId: startupId || (startups[0]?.id || '') });
      setIsEditMode(false);
    }
    setIsVacancyModalOpen(true);
  };

  const viewApplicants = async (vacancyId) => {
    try {
      const res = await vacancyService.getApplications(vacancyId);
      setApplicants(res.data);
      setIsApplicantModalOpen(true);
    } catch (err) {
      triggerToast('Xəta', 'Müraciətləri yükləmək mümkün olmadı.', 'error');
    }
  };

  const openProfileModal = () => {
    setProfileForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      username: profile?.username || user?.username || '',
      phoneNumber: profile?.phoneNumber || '',
      linkedinUrl: profile?.linkedinUrl || '',
      githubUrl: profile?.githubUrl || ''
    });
    setIsProfileModalOpen(true);
  };

  const statusIcon = (s) => {
    switch (s) {
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'CANCELED': return <AlertCircle className="w-4 h-4 text-slate-600" />;
      default: return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const statusLabel = (s) => {
    switch (s) {
      case 'PENDING': return 'Gözləmədə';
      case 'ACCEPTED': return 'Qəbul edildi';
      case 'REJECTED': return 'Rədd edildi';
      case 'CANCELED': return 'Ləğv edildi';
      default: return s;
    }
  };

  const tabs = [
    { id: 'startups', label: 'Startaplar', icon: LayoutGrid },
    { id: 'vacancies', label: 'Vakansiyalar', icon: Briefcase },
    { id: 'applications', label: 'Müraciətlər', icon: Send },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const userInitial = profile?.firstName?.[0] || user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] 
                       bg-navy-900 text-white px-5 md:px-7 py-3.5 md:py-4 rounded-2xl 
                       shadow-2xl flex items-center gap-3 md:gap-4 border border-white/10
                       min-w-[280px] md:min-w-[320px] max-w-[90vw]"
          >
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toastMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{toastMessage.title}</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">{toastMessage.sub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-5 md:space-y-6">
            <div className="card p-5 md:p-6 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-navy-900 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-emerald-400 mx-auto mb-3 md:mb-4 shadow-sm">
                {userInitial}
              </div>
              <h2 className="text-base md:text-lg font-bold text-navy-950 mb-0.5 truncate">{profile?.firstName || user?.username || 'İstifadəçi'}</h2>
              <p className="text-[10px] md:text-xs font-medium text-slate-600 truncate">{user?.email}</p>
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <div className="text-lg md:text-xl font-black text-navy-950">{startups.length}</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Startap</div>
                </div>
                <div className="border-l border-slate-100">
                  <div className="text-lg md:text-xl font-black text-navy-950">{myApplications.length}</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Müraciət</div>
                </div>
              </div>
            </div>

            <nav className="card p-2 md:p-3 space-y-0.5 md:space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-navy-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-navy-950 truncate">
                Xoş gəldin, <span className="text-gradient">{profile?.firstName || user?.username || 'İstifadəçi'}</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium mt-0.5">Ekosistemdə nələr baş verir?</p>
            </div>
            <button
              onClick={() => { if (activeTab === 'vacancies') openVacancyModal(); else openStartupModal(); }}
              className="btn-primary text-xs md:text-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{activeTab === 'vacancies' ? 'Vakansiya' : 'Startap'}</span>
              <span className="sm:hidden">{activeTab === 'vacancies' ? 'Vakansiya' : 'Startap'}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'startups' && (
              <motion.div key="s" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {[1, 2].map(i => <div key={i} className="h-44 md:h-48 shimmer" />)}
                  </div>
                ) : startups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {startups.map(s => (
                      <motion.div key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="card p-5 md:p-6 cursor-default group"
                      >
                          <div className="flex items-start justify-between mb-4 md:mb-5">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all duration-500">
                              <Rocket className="w-5 h-5 md:w-6 md:h-6 text-navy-500 group-hover:text-emerald-600" />
                            </div>
                            <div className="flex gap-0.5">
                              <button onClick={() => openStartupModal(s)}
                                className="p-1.5 md:p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Redaktə et">
                                <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                              <button onClick={() => handleDeleteStartup(s.id, s.name)}
                                className="p-1.5 md:p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100" title="Sil">
                                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              </button>
                            </div>
                          </div>
                        <h3 className="text-base md:text-lg font-bold text-navy-950 mb-0.5 truncate">{s.name}</h3>
                        {s.tagline && <p className="text-xs md:text-sm font-semibold text-emerald-600 mb-2 md:mb-3 truncate">{s.tagline}</p>}
                        <p className="text-xs md:text-sm text-slate-700 line-clamp-2 leading-relaxed mb-4 md:mb-5">{s.description}</p>
                        <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-slate-100">
                          <div className="flex gap-1.5 md:gap-2">
                            <span className="badge-slate text-[10px] uppercase tracking-wider">{s.stage || 'İDEYA'}</span>
                            <span className="badge-slate text-[10px] uppercase tracking-wider">{s.category || 'TEX'}</span>
                          </div>
                          {s.website && (
                            <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-emerald-600 transition-colors">
                              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => openVacancyModal(null, s.id)}
                          className="mt-3 w-full py-2 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-transparent hover:border-emerald-200"
                        >
                          + Vakansiya əlavə et
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="card-lg border-dashed border-slate-300 p-12 md:p-20 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 border border-slate-200">
                      <Rocket className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-navy-950 mb-2">Hələ startapınız yoxdur</h3>
                    <p className="text-xs md:text-sm text-slate-600 mb-6 md:mb-8 max-w-xs mx-auto">İlk startapınızı yaradın və komandanızı qurmağa başlayın.</p>
                    <button onClick={() => openStartupModal()} className="btn-primary text-xs md:text-sm">
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> İlk startapımı yarat
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'vacancies' && (
              <motion.div key="v" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {loading ? (
                  <div className="space-y-3 md:space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-20 shimmer" />)}
                  </div>
                ) : userVacancies.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {userVacancies.map(v => (
                      <motion.div key={v.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="card !p-4 md:!p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4"
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                            <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-navy-500" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm md:text-base font-bold text-navy-950 truncate">{v.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-600 font-medium mt-0.5">
                              <span className="font-bold text-emerald-600 truncate">{v.startup?.name || v.startupName}</span>
                              {v.salary && <span className="flex items-center gap-0.5 shrink-0"><DollarSign className="w-3 h-3 text-emerald-500" />{v.salary} ₼</span>}
                              <span className={`badge ${v.isActive !== false ? 'badge-green' : 'badge-slate'} text-[10px]`}>
                                {v.isActive !== false ? 'Aktiv' : 'Deaktiv'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 md:gap-2 shrink-0">
                          <button onClick={() => viewApplicants(v.id)}
                            className="btn-ghost text-[10px] md:text-xs gap-1 font-bold">
                            <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> Müraciətlər
                          </button>
                          <button onClick={() => openVacancyModal(v)}
                            className="btn-ghost text-[10px] md:text-xs">
                            <Edit3 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="card-lg border-dashed border-slate-300 p-12 md:p-20 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 border border-slate-200">
                      <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-navy-950 mb-2">Vakansiya yoxdur</h3>
                    <p className="text-xs md:text-sm text-slate-600 mb-6 md:mb-8 max-w-xs mx-auto">Startaplarınız üçün vakansiya yaradın.</p>
                    <button onClick={() => openVacancyModal()} className="btn-primary text-xs md:text-sm">
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> Vakansiya yarat
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div key="a" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {myApplications.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {myApplications.map(app => (
                      <motion.div key={app.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="card !p-4 md:!p-6 flex items-center gap-3 md:gap-4"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
                          <Send className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm md:text-base font-bold text-navy-950 truncate">{app.jobTitle}</h3>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-600 font-medium mt-0.5">
                            <span className="flex items-center gap-1">{statusIcon(app.status)} {statusLabel(app.status)}</span>
                            {app.appliedAt && <span>{new Date(app.appliedAt).toLocaleDateString('az-AZ')}</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="card-lg border-dashed border-slate-300 p-12 md:p-20 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 border border-slate-200">
                      <Send className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-navy-950 mb-2">Müraciətiniz yoxdur</h3>
                    <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 max-w-xs mx-auto">Hələ heç bir vakansiyaya müraciət etməmisiniz.</p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-wider mb-5 md:mb-6">Müraciət etdikdən sonra burada görünəcək</p>
                    <a href="/vacancies" className="btn-primary text-xs md:text-sm inline-flex">
                      <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" /> Vakansiyaları kəşf et
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="p" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="card !p-6 md:!p-8 space-y-5 md:space-y-6">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-navy-50 rounded-xl flex items-center justify-center border border-navy-200">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-navy-600" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-navy-950">Şəxsi məlumatlar</h3>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Ad</label>
                          <p className="text-xs md:text-sm font-semibold text-navy-950 mt-0.5 md:mt-1">{profile?.firstName || '—'}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Soyad</label>
                          <p className="text-xs md:text-sm font-semibold text-navy-950 mt-0.5 md:mt-1">{profile?.lastName || '—'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">İstifadəçi</label>
                        <p className="text-xs md:text-sm font-semibold text-navy-950 mt-0.5 md:mt-1 truncate">{profile?.username || user?.username}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">E-poçt</label>
                        <p className="text-xs md:text-sm font-semibold text-navy-950 mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2 truncate">
                          <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-600 shrink-0" /> {user?.email}
                        </p>
                      </div>
                      {profile?.phoneNumber && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Telefon</label>
                          <p className="text-xs md:text-sm font-semibold text-navy-950 mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2">
                            <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-600 shrink-0" /> {profile.phoneNumber}
                          </p>
                        </div>
                      )}
                      <div className="flex gap-3 md:gap-4 pt-0.5 md:pt-1">
                        {profile?.linkedinUrl && (
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                            <Linkedin className="w-3 h-3 md:w-3.5 md:h-3.5" /> LinkedIn
                          </a>
                        )}
                        {profile?.githubUrl && (
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                            <Github className="w-3 h-3 md:w-3.5 md:h-3.5" /> GitHub
                          </a>
                        )}
                      </div>
                      <button onClick={openProfileModal} className="btn-primary w-full text-xs md:text-sm mt-1 md:mt-2">
                        Redaktə et
                      </button>
                    </div>
                  </div>

                  <div className="card !p-6 md:!p-8 space-y-5 md:space-y-6">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200">
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-navy-950">CV İdarəetməsi</h3>
                    </div>
                    {cv ? (
                      <div className="p-4 md:p-5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-emerald-600 shrink-0 border border-slate-100">
                              <FileText className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-navy-950 truncate">{cv.originalFileName || 'CV.pdf'}</span>
                          </div>
                          <div className="flex gap-1 md:gap-1.5 shrink-0">
                            <button onClick={handlePreviewCv} className="p-1.5 md:p-2 text-slate-600 hover:text-emerald-600 hover:bg-white rounded-lg transition-all" title="Önizlə">
                              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <a href={cv.url} target="_blank" rel="noopener noreferrer"
                               className="p-1.5 md:p-2 text-slate-600 hover:text-emerald-600 hover:bg-white rounded-lg transition-all" title="Aç">
                              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </a>
                            <button onClick={handleDeleteCv} className="p-1.5 md:p-2 text-slate-600 hover:text-red-500 hover:bg-white rounded-lg transition-all" title="Sil">
                              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 md:p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3 md:space-y-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto border border-slate-200">
                          <Upload className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">Hələ CV yükləməmisiniz</p>
                        <label className="cursor-pointer inline-block">
                          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} accept=".pdf,.doc,.docx" />
                          <span className={`inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-emerald-600 text-white text-[10px] md:text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {uploading ? 'Yüklənir...' : 'CV Yüklə'}
                          </span>
                        </label>
                      </div>
                    )}
                    <div className="p-4 md:p-5 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex gap-2.5 md:gap-3">
                        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] md:text-xs text-amber-800 font-medium leading-relaxed">
                          CV vakansiyalara müraciət zamanı işəgötürənlər tərəfindən görünəcək. PDF formatına üstünlük verin.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isStartupModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsStartupModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-navy-900" />
              <h2 className="text-lg md:text-xl font-bold text-navy-950 mb-5 md:mb-6">{isEditMode ? 'Startapı Redaktə Et' : 'Yeni Startap'}</h2>
              <form onSubmit={handleStartupSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Ad</label>
                  <input type="text" required className="input-simple" value={startupForm.name} onChange={e => setStartupForm({ ...startupForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Tagline</label>
                  <input type="text" className="input-simple" placeholder="Gələcəyin texnologiyası" value={startupForm.tagline} onChange={e => setStartupForm({ ...startupForm, tagline: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Kateqoriya</label>
                    <select className="input-simple" value={startupForm.category} onChange={e => setStartupForm({ ...startupForm, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Mərhələ</label>
                    <select className="input-simple" value={startupForm.stage} onChange={e => setStartupForm({ ...startupForm, stage: e.target.value })}>
                      {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Vebsayt</label>
                  <input type="url" className="input-simple" placeholder="https://example.com" value={startupForm.website} onChange={e => setStartupForm({ ...startupForm, website: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Haqqında</label>
                  <textarea required rows={3} className="input-simple" value={startupForm.description} onChange={e => setStartupForm({ ...startupForm, description: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-1 md:pt-2">
                  <button type="button" onClick={() => setIsStartupModalOpen(false)}
                    className="flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all">Ləğv et</button>
                  <button type="submit" className="flex-[2] btn-primary !py-2.5 md:!py-3 text-xs md:text-sm">Yadda saxla</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVacancyModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsVacancyModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
              <h2 className="text-lg md:text-xl font-bold text-navy-950 mb-5 md:mb-6">{isEditMode ? 'Vakansiyanı Redaktə Et' : 'Yeni Vakansiya'}</h2>
              <form onSubmit={handleVacancySubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Başlıq</label>
                  <input type="text" required className="input-simple" value={vacancyForm.title} onChange={e => setVacancyForm({ ...vacancyForm, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Maaş (AZN)</label>
                    <input type="number" className="input-simple" value={vacancyForm.salary} onChange={e => setVacancyForm({ ...vacancyForm, salary: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Startap</label>
                    <select required className="input-simple" value={vacancyForm.startupId} onChange={e => setVacancyForm({ ...vacancyForm, startupId: e.target.value })}>
                      <option value="">Seçin</option>
                      {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Təsvir</label>
                  <textarea required rows={3} className="input-simple" value={vacancyForm.description} onChange={e => setVacancyForm({ ...vacancyForm, description: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-1 md:pt-2">
                  <button type="button" onClick={() => setIsVacancyModalOpen(false)}
                    className="flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all">Ləğv et</button>
                  <button type="submit" className="flex-[2] btn-primary !py-2.5 md:!py-3 text-xs md:text-sm">Paylaş</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isApplicantModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsApplicantModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-navy-950">Müraciət edənlər</h2>
                <button onClick={() => setIsApplicantModalOpen(false)}
                  className="p-1.5 md:p-2 text-slate-600 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 pr-1">
                {applicants.length > 0 ? applicants.map((app, i) => (
                  <div key={i} className="p-4 md:p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xs md:text-sm shadow-sm shrink-0">
                        {app.firstname?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-bold text-navy-950 truncate">{app.firstname} {app.lastname}</p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-600 font-medium mt-0.5">
                          <span className="truncate">{app.email}</span>
                          <span className="flex items-center gap-1 shrink-0">{statusIcon(app.status)} {statusLabel(app.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 md:py-16 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 border border-slate-200">
                      <User className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 font-medium">Hələ müraciət yoxdur.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
              <h2 className="text-lg md:text-xl font-bold text-navy-950 mb-5 md:mb-6">Profili Redaktə Et</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Ad</label>
                    <input type="text" required className="input-simple" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Soyad</label>
                    <input type="text" required className="input-simple" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">İstifadəçi adı</label>
                  <div className="relative">
                    <User className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-600" />
                    <input type="text" required className="input-simple pl-9 md:pl-10" value={profileForm.username} onChange={e => setProfileForm({ ...profileForm, username: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-600" />
                    <input type="text" className="input-simple pl-9 md:pl-10" placeholder="+994501234567" value={profileForm.phoneNumber} onChange={e => setProfileForm({ ...profileForm, phoneNumber: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-600" />
                    <input type="url" className="input-simple pl-9 md:pl-10" placeholder="https://linkedin.com/in/..." value={profileForm.linkedinUrl} onChange={e => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block ml-1">GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-600" />
                    <input type="url" className="input-simple pl-9 md:pl-10" placeholder="https://github.com/..." value={profileForm.githubUrl} onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 pt-1 md:pt-2">
                  <button type="button" onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all">Ləğv et</button>
                  <button type="submit" className="flex-[2] btn-primary !py-2.5 md:!py-3 text-xs md:text-sm">Yadda saxla</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
