'use client';

import {
  createContext, useContext, useReducer, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

type ToastAction =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string };

interface ToastContextType {
  toasts: Toast[];
  toast: (opts: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => void;
  dismiss: (id: string) => void;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      return [...state.slice(-4), action.toast]; // máx 5 toasts
    case 'REMOVE':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

// ── Individual Toast ──────────────────────────────────────────────────────────

const LABELS: Record<ToastType, string> = {
  success: 'Éxito',
  error:   'Error',
  warning: 'Advertencia',
  info:    'Info',
};

const COLORS: Record<ToastType, { bg: string; border: string; bar: string }> = {
  success: { bg: '#f0fdf4', border: '#86efac', bar: '#22c55e' },
  error:   { bg: '#fef2f2', border: '#fca5a5', bar: '#ef4444' },
  warning: { bg: '#fffbeb', border: '#fde68a', bar: '#f59e0b' },
  info:    { bg: '#eff6ff', border: '#93c5fd', bar: '#3b82f6' },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const barRef = useRef<HTMLDivElement>(null);
  const c = COLORS[toast.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration);
    if (barRef.current) {
      barRef.current.style.transition = `width ${toast.duration}ms linear`;
      barRef.current.style.width = '0%';
    }
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      padding: '12px 14px',
      minWidth: 300,
      maxWidth: 380,
      boxShadow: '0 4px 20px rgba(0,0,0,.12)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'toast-in .25s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <div style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: '.65rem', fontWeight: 800, color: c.bar,
          textTransform: 'uppercase', letterSpacing: '.05em',
          flexShrink: 0, paddingTop: '.2rem',
        }}>
          {LABELS[toast.type]}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#111827' }}>{toast.title}</div>
          {toast.message && (
            <div style={{ fontSize: '.8rem', color: '#4b5563', marginTop: '.2rem', lineHeight: 1.4 }}>
              {toast.message}
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9ca3af', fontSize: '1rem', padding: '0 2px', lineHeight: 1,
            flexShrink: 0,
          }}
        >×</button>
      </div>
      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,.06)' }}>
        <div
          ref={barRef}
          style={{ height: '100%', width: '100%', background: c.bar, borderRadius: '0 0 10px 10px' }}
        />
      </div>
    </div>
  );
}

// ── Container ─────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(16px) scale(.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '.6rem',
        zIndex: 9999,
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const toast = useCallback((opts: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => {
    const id = `${Date.now()}-${Math.random()}`;
    dispatch({ type: 'ADD', toast: { ...opts, id, duration: opts.duration ?? 4000 } });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
