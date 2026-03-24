import { useState } from 'react'
import { useGoogleSync } from '../hooks/useGoogleSync'

const ADMIN_PASSWORD = 'metro@2026'

function ShuttlecockLoader() {
  return (
    <div className="flex items-center gap-2 bg-blue-600/10 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 animate-pulse">
      <div className="relative w-4 h-4 animate-bounce">
        <span className="absolute inset-0 text-xs text-center">🏸</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">Live Syncing</span>
    </div>
  )
}

export default function Header({ isAdmin, onSetAdmin }) {
  const { isSyncing, lastSync } = useGoogleSync(isAdmin)
  const [showConfig, setShowConfig] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onSetAdmin(true)
      setPassword('')
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  const handleLogout = () => {
    onSetAdmin(false)
    setPassword('')
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="transition-transform group-hover:translate-x-1">
              <h1 className="text-2xl font-black text-[#5F59FF] leading-tight tracking-tighter italic uppercase">
                METROPOLIS
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 leading-none">
                Badminton Tournament <span className="w-1 h-1 bg-[#5F59FF] rounded-full animate-pulse" />
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isSyncing ? (
              <ShuttlecockLoader />
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                CLOUD ACTIVE
              </div>
            )}

            <div className="h-6 w-px bg-slate-100 mx-1" />

            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="hidden sm:flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                  🛡️ ADMIN
                </span>
              )}
              <button 
                onClick={() => setShowConfig(!showConfig)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${showConfig ? 'bg-[#5F59FF] text-white rotate-90' : 'bg-slate-50 text-slate-400 hover:bg-slate-200'}`}
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {showConfig && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl shadow-blue-900/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Information</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded">V 2.0.0</span>
                {isAdmin ? (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">ADMIN ACCESS</span>
                ) : (
                  <span className="text-[10px] font-bold bg-white/5 text-slate-500 px-2 py-1 rounded">VIEW ONLY</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Cloud Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2.5 border-b border-white/5">
                  <span className="text-xs text-slate-500 font-medium">Cloud Storage</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase italic">Active</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-white/5">
                  <span className="text-xs text-slate-500 font-medium">Last Cloud Sync</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase">
                    {lastSync ? lastSync.toLocaleTimeString() : 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-slate-500 font-medium">Sync Interval</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">Real-Time</span>
                </div>
              </div>

              {/* Admin Auth Panel */}
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 flex flex-col justify-center gap-3">
                {isAdmin ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🛡️</span>
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Organizer Access Granted</span>
                    </div>
                    <p className="text-[9px] text-slate-500 italic leading-relaxed">
                      You have full control over players, pairings, scores, and tournament management.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full mt-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                      🔓 Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🔐</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organizer Sign In</span>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="Enter admin password"
                      className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-all ${
                        error 
                          ? 'border-red-500/60 ring-1 ring-red-500/30 animate-pulse' 
                          : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/30'
                      }`}
                    />
                    {error && (
                      <p className="text-[9px] text-red-400 font-bold uppercase tracking-wide -mt-1">❌ Incorrect password</p>
                    )}
                    <button
                      onClick={handleLogin}
                      className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#5F59FF]/20 text-[#5F59FF] border border-[#5F59FF]/30 hover:bg-[#5F59FF]/30 transition-all"
                    >
                      Unlock Admin Access
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-2 pt-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-400/80 text-sm">
                ℹ️
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                {isAdmin 
                  ? "You are currently pushing live updates to the designated Google Sheet." 
                  : "You are currently viewing a live-synced version of the tournament."}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
