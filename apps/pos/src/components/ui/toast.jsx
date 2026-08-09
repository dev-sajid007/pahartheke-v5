"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

const nextId = () => ++idCounter;

const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback((type, message, duration = 4000) => {
    const id = nextId();
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
    const timer = setTimeout(() => dismiss(id), duration);
    timersRef.current.set(id, timer);
  }, [dismiss]);

  const success = useCallback((message) => push("success", message), [push]);
  const error = useCallback((message) => push("error", message), [push]);
  const info = useCallback((message) => push("info", message), [push]);

  const value = useMemo(
    () => ({ success, error, info, dismiss }),
    [success, error, info, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const typeStyles = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    border: "border-emerald-200 dark:border-emerald-900/40",
  },
  error: {
    icon: XCircle,
    iconClass: "text-rose-500",
    border: "border-rose-200 dark:border-rose-900/40",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    border: "border-blue-200 dark:border-blue-900/40",
  },
};

const Toaster = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => {
        const { icon: Icon, iconClass, border } = typeStyles[toast.type] || typeStyles.info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200 ${border}`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
            <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="rounded-md p-0.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ToastContextProvider;
