export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  )
}
