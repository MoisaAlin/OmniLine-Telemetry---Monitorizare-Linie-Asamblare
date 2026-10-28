import React, { useEffect } from 'react';
import { TechnicalNotification } from '../types/assemblyLine';
import { Bell, X, Check, ShieldAlert, AlertTriangle, Info, CheckCheck } from 'lucide-react';

interface TechnicalAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: TechnicalNotification[];
  onAcknowledgeNotification: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const TechnicalAlertsDrawer: React.FC<TechnicalAlertsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onAcknowledgeNotification,
  onMarkAllAsRead,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Dispecerat Alerte Echipă Tehnică
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} noi
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors p-1"
                title="Marchează toate ca citite"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Închide dispeceratul"
              aria-label="Închide dispeceratul"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nicio notificare tehnică activă.
            </div>
          ) : (
            notifications.map((notif) => {
              const isCrit = notif.type === 'critical_alarm' || notif.type === 'safety_stop';
              const isWarn = notif.type === 'warning';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs ${
                    isCrit
                      ? 'bg-rose-950/30 border-rose-500/60'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  } ${!notif.isRead ? 'ring-1 ring-amber-500/40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      {isCrit ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-400 shrink-0" />
                      )}
                      <span className="font-semibold text-white">{notif.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                    {notif.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Destinatar: </span>
                      <span className="font-semibold text-amber-400 font-mono">
                        {notif.targetRole}
                      </span>
                    </div>

                    {notif.acknowledgedBy ? (
                      <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Preluat de: {notif.acknowledgedBy}
                      </span>
                    ) : (
                      <button
                        onClick={() => onAcknowledgeNotification(notif.id)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-medium transition-colors"
                      >
                        Confirmă Preluare
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-400 shrink-0">
          Apasă ESC sau clic pe fundal pentru a ieși
        </div>
      </div>
    </div>
  );
};
