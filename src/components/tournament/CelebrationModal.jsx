import { useState } from 'react'

function Confetti() {
  const [pieces] = useState(() => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5 + 's',
      duration: (Math.random() * 3 + 2) + 's',
      rotation: Math.random() * 360 + 'deg'
    }))
  })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {pieces.map((p) => (
        <div 
          key={p.id}
          className="confetti"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation})`
          }}
        />
      ))}
    </div>
  )
}

export default function CelebrationModal({ champion, pairs, onReset }) {
  if (!champion) return null
  const team = pairs.find((p) => p.courtNumber === champion)

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500" />
      
      {/* Confetti */}
      <Confetti />

      {/* Content */}
    <div className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl shadow-blue-500/20 animate-in zoom-in slide-in-from-bottom-8 duration-700">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="text-9xl mb-2 animate-tada relative z-10">🏆</div>
        </div>
        
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Tournament Champion</h2>
        <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter mb-8 uppercase">
          SMASH<span className="text-blue-600">CENTER</span> VICTOR
        </h1>

        <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 mb-8 transform hover:scale-105 transition-transform">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Team {champion}</p>
          <div className="space-y-2">
            <p className="text-3xl font-black text-slate-900 italic tracking-tight">{team?.advanced}</p>
            <div className="w-8 h-1 bg-blue-600 mx-auto rounded-full" />
            <p className="text-xl font-bold text-slate-500">{team?.intermediate}</p>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
        >
          Reset Tournament
        </button>
        
        <p className="text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest leading-none">
          Congratulations to the champions of April 17th!
        </p>
      </div>
    </div>
  )
}
