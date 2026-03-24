function TeamRow({ teamNum, pair, score, isWinner, isLoser, isAdmin, onScore, onPick }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
        isWinner
          ? 'bg-amber-50 border-amber-300'
          : isLoser
          ? 'bg-slate-50 border-slate-100 opacity-40'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Pick winner circle */}
      <button
        onClick={onPick}
        disabled={!isAdmin}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isWinner
            ? 'bg-amber-400 border-amber-400 text-white'
            : isAdmin
            ? 'border-slate-300 hover:border-amber-400 bg-white cursor-pointer'
            : 'border-slate-200 bg-slate-100 cursor-not-allowed'
        }`}
      >
        {isWinner && <span className="text-[10px] font-bold leading-none">✓</span>}
      </button>

      {/* Names */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-500">Team {teamNum}</p>
        {pair ? (
          <>
            <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{pair.advanced}</p>
            <p className="text-xs text-slate-400 truncate">{pair.intermediate}</p>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic">TBD</p>
        )}
      </div>

      {/* Score */}
      <input
        type="number"
        min="0"
        max="99"
        value={score}
        onChange={(e) => onScore(e.target.value)}
        placeholder="-"
        disabled={!isAdmin}
        className={`w-10 text-center text-base font-bold rounded border py-1 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
          !isAdmin
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : isWinner
            ? 'bg-amber-100 border-amber-300 text-amber-800'
            : 'bg-white border-slate-300 text-slate-700'
        }`}
      />
    </div>
  )
}

export default function MatchCard({ match, pairs, stageKey, label, index, isAdmin, onUpdate, onSetWinner }) {
  const homePair = pairs.find((p) => p.courtNumber === match.home)
  const awayPair = pairs.find((p) => p.courtNumber === match.away)

  return (
    <div
      className="animate-slide-up bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-0"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
    >
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        {match.winner !== null && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            ✓ Done
          </span>
        )}
      </div>
      <div className="p-2 space-y-1.5">
        <TeamRow
          teamNum={match.home}
          pair={homePair}
          score={match.homeScore}
          isWinner={match.winner === match.home}
          isLoser={match.winner === match.away}
          isAdmin={isAdmin}
          onScore={(v) => onUpdate(stageKey, match.id, 'homeScore', v)}
          onPick={() => onSetWinner(stageKey, match.id, match.home)}
        />
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-[10px] font-bold text-slate-400">VS</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>
        <TeamRow
          teamNum={match.away}
          pair={awayPair}
          score={match.awayScore}
          isWinner={match.winner === match.away}
          isLoser={match.winner === match.home}
          isAdmin={isAdmin}
          onScore={(v) => onUpdate(stageKey, match.id, 'awayScore', v)}
          onPick={() => onSetWinner(stageKey, match.id, match.away)}
        />
      </div>
    </div>
  )
}
