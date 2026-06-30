"use client"

import Link from "next/link"

export default function CheckoutError({ error, reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-background">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="rounded-xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Something went wrong</h2>
          <p className="mt-2 text-sm text-[#888]">
            {error?.message || "Failed to load checkout. Please try again."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="rounded-lg bg-[#E07B2E] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Try again
            </button>
            <Link
              href="/shop"
              className="rounded-lg border border-[#E0E0E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:bg-gray-50"
            >
              Return to shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
