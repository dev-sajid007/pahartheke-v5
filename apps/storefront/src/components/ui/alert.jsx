"use client"

import { AlertTriangle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const variantConfig = {
  destructive: {
    Icon: AlertTriangle,
    containerClass:
      "border-red-500/20 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-950 dark:text-red-300",
    iconClass: "text-red-500 dark:text-red-400",
  },
  success: {
    Icon: CheckCircle2,
    containerClass:
      "border-green-500/20 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-950 dark:text-green-300",
    iconClass: "text-green-500 dark:text-green-400",
  },
}

export default function Alert({
  variant = "destructive",
  message,
  onRetry,
  retryLabel = "Retry",
  loading = false,
  onDismiss,
  className,
}) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !message) return null

  const config = variantConfig[variant] || variantConfig.destructive
  const { Icon, containerClass, iconClass } = config

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm shadow-xs transition",
        containerClass,
        className
      )}
      role="alert"
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClass)} />

      <div className="flex-1 min-w-0">
        <p className="leading-relaxed">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className={cn(
              "mt-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition",
              variant === "destructive"
                ? "border-red-300 bg-white text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                : "border-green-300 bg-white text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
            )}
          >
            {loading ? "Processing..." : retryLabel}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          "shrink-0 rounded-md p-1 transition",
          variant === "destructive"
            ? "text-red-400 hover:bg-red-200/60 hover:text-red-600 dark:text-red-500 dark:hover:bg-red-800 dark:hover:text-red-300"
            : "text-green-400 hover:bg-green-200/60 hover:text-green-600 dark:text-green-500 dark:hover:bg-green-800 dark:hover:text-green-300"
        )}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
