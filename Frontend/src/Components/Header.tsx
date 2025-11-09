export function Header() {
  return (
    <div className="absolute top-6 left-6 z-50 pointer-events-none">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border border-blue-500/30 rounded-lg shadow-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-white tracking-wide">SyncBoard</span>
      </div>
    </div>
  )
}
