"use client"

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-[#1a2e1a] mb-3">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
