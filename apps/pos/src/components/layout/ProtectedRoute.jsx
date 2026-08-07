"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

const PENDING = Symbol("pending");
const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getTokenSnapshot() {
  return typeof window === "undefined" ? null : localStorage.getItem("token");
}

function getServerSnapshot() {
  return PENDING;
}

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getTokenSnapshot, getServerSnapshot);

  useEffect(() => {
    listeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    if (token !== PENDING && !token) {
      router.replace("/login");
    }
  }, [token, router]);

  // Don't render children until we know they are authenticated to prevent UI flashing
  if (token === PENDING || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-sidebar-foreground">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
