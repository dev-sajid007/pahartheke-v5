"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

function getTokenSnapshot() {
  return typeof window === "undefined" ? "" : localStorage.getItem("token") ?? "";
}

const emptySubscribe = () => () => {};

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const token = useSyncExternalStore(emptySubscribe, getTokenSnapshot, () => "");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  // Don't render children until we know they are authenticated to prevent UI flashing
  if (!token) {
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
