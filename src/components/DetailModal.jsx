import { X, Globe, Building2, DollarSign, Calendar, User, Tag, Target, ShieldCheck, Mail } from 'lucide-react';

const DetailModal = ({ isOpen, onClose, vacancy, startup: directStartup, applied, onApply, onCancel, onViewApplicants }) => {
  const startup = vacancy?.startup || directStartup;
  const isVacancyMode = !!vacancy;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-ink-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-ink-100 hover:bg-ink-200 flex items-center justify-center transition-colors duration-150"
        >
          <X className="w-4 h-4 text-ink-600" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0">
              {startup?.name?.[0] || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              {isVacancyMode ? (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-ink-900 leading-tight mb-1">{vacancy?.title}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-emerald-600">{startup?.name || 'Anonim Startap'}</span>
                    {startup?.category && <span className="badge-emerald text-[10px]">{startup.category}</span>}
                    {vacancy?.isActive === false && <span className="badge-amber text-[10px]">Deaktiv</span>}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-ink-900 leading-tight mb-1">{startup?.name}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {startup?.category && <span className="badge-emerald text-[10px]">{startup.category}</span>}
                    {startup?.stage && <span className="badge-slate text-[10px]">{startup.stage}</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-ink-100 mb-6" />

          <div className={`grid grid-cols-1 ${isVacancyMode ? 'md:grid-cols-2' : ''} gap-6`}>
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-500 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Startap
              </div>

              {startup?.tagline && (
                <div>
                  <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Sloqan</div>
                  <p className="text-sm font-semibold text-ink-900">{startup.tagline}</p>
                </div>
              )}

              {startup?.description && (
                <div>
                  <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Haqqında</div>
                  <p className="text-sm text-ink-600 leading-relaxed">{startup.description}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {startup?.stage && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 bg-ink-50 px-3 py-1.5">
                    <Target className="w-3 h-3 text-emerald-500" />
                    {startup.stage}
                  </div>
                )}
                {startup?.website && (
                  <a href={startup.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 transition-colors duration-150">
                    <Globe className="w-3 h-3" />
                    {startup.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              {startup?.owner && (
                <div>
                  <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Sahib</div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-ink-900 flex items-center justify-center text-white font-bold text-xs">
                      {startup.owner.firstname?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-bold text-ink-900">{startup.owner.firstname} {startup.owner.lastname}</span>
                  </div>
                  <a href={`mailto:${startup.owner.email}`} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-150">
                    {startup.owner.email}
                  </a>
                </div>
              )}

              {startup?.createdAt && (
                <div>
                  <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Yaranma</div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-600">
                    <Calendar className="w-3.5 h-3.5 text-ink-400" />
                    {new Date(startup.createdAt).toLocaleDateString('az-AZ', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>

            {isVacancyMode && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-ink-500 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" /> Vakansiya
                </div>

                {vacancy?.description && (
                  <div>
                    <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Təsvir</div>
                    <p className="text-sm text-ink-600 leading-relaxed">{vacancy.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-ink-900 bg-ink-50 px-3 py-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {vacancy?.salary ? `${vacancy.salary} ₼` : 'Razılaşma'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 bg-ink-50 px-3 py-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    {vacancy?.isActive ? 'Aktiv' : 'Deaktiv'}
                  </div>
                </div>

                {vacancy?.createdAt && (
                  <div>
                    <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Tarix</div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-600">
                      <Calendar className="w-3.5 h-3.5 text-ink-400" />
                      {new Date(vacancy.createdAt).toLocaleDateString('az-AZ', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}

                {startup?.owner && (
                  <div>
                    <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Tərəfindən</div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                        {startup.owner.firstname?.[0] || startup.owner.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink-900 leading-tight">
                          {startup.owner.firstname} {startup.owner.lastname}
                        </div>
                        <div className="text-[11px] text-ink-500 font-medium">{startup.owner.email}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {isVacancyMode && (
            <>
              <div className="h-px bg-ink-100 my-6" />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <User className="w-3 h-3" />
                  <span>{startup?.owner ? `${startup.owner.firstname} ${startup.owner.lastname} tərəfindən yerləşdirilib` : 'Startap tərəfindən yerləşdirilib'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {vacancy?.isOwner && (
                    <button
                      onClick={() => { onViewApplicants?.(vacancy.id); onClose(); }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-ink-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-ink-800 transition-colors duration-150"
                    >
                      <User className="w-3.5 h-3.5" /> Müraciət edənlər
                    </button>
                  )}
                  {applied ? (
                    <button
                      onClick={() => { onCancel?.(vacancy.id); onClose(); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 text-sm font-bold hover:bg-amber-100 border border-amber-200/50 transition-colors duration-150"
                    >
                      <X className="w-4 h-4" /> Müraciəti ləğv et
                    </button>
                  ) : (
                    <button
                      onClick={() => { onApply?.(vacancy.id); onClose(); }}
                      className="btn-primary text-sm"
                    >
                      Müraciət et
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {!isVacancyMode && startup?.owner && (
            <>
              <div className="h-px bg-ink-100 my-6" />
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <Mail className="w-3 h-3" />
                <span>Əlaqə: <a href={`mailto:${startup.owner.email}`} className="text-emerald-600 hover:text-emerald-700 font-semibold">{startup.owner.email}</a></span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
