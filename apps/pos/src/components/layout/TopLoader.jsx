"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(pathname + (searchParams?.toString() || ""));

  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() || "");
    if (currentPath !== prevPath.current) {
      prevPath.current = currentPath;
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 z-[9999] w-full h-1">
      <div className="h-full bg-primary animate-progress" />
    </div>
  );
}
