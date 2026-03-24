import MatchCard from './MatchCard'
import CelebrationModal from './CelebrationModal'
import Leaderboard from './Leaderboard'
import { calculateStandings } from '../../hooks/useTournament'

const STAGE_ORDER = ['groups', 'semi', 'final', 'champion']

function stageReached(current, target) {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(target)
}



function BracketSection({ title, emoji, matches, stageKey, pairs, isActive, isComplete, isPending, isAdmin, onUpdate, onSetWinner, gridCols }) {
  return (
    <div className="space-y-3">
      {/* Stage header */}
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <h3 className="text-base font-bold text-slate-700">{title}</h3>
        {isActive && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">In Progress</span>
        )}
        {isComplete && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Complete ✓</span>
        )}
        {isPending && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium">Waiting...</span>
        )}
      </div>

      {/* Match cards or placeholder */}
      {isPending ? (
        <div className="text-sm text-slate-400 italic pl-1">Waiting for previous round to complete</div>
      ) : (
        <div className={`grid gap-4 ${gridCols}`}>
          {matches.map((match, i) => (
            <MatchCard
              key={match.id}
              match={match}
              pairs={pairs}
              stageKey={stageKey}
              label={match.court ? `Court ${match.court}` : matches.length === 1 ? 'Grand Final' : `Match ${i + 1}`}
              index={i}
              isAdmin={isAdmin}
              onUpdate={onUpdate}
              onSetWinner={onSetWinner}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function formatTime(startTime, minutesToAdd) {
  const date = new Date(startTime)
  date.setMinutes(date.getMinutes() + minutesToAdd)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ScheduleEstimator({ 
  matchCount, 
  courtCount, 
  matchDuration = 20, 
  leagueBreak = 10,
  knockoutBreak = 15,
  startTime = "2026-04-17T13:00:00"
}) {
  const leagueRounds = Math.ceil((matchCount || 0) / courtCount)
  const leagueTotal = leagueRounds > 0 
    ? (leagueRounds * matchDuration) + ((leagueRounds - 1) * leagueBreak)
    : 0
  
  // Total includes 2 knockout stages (SF, Final) + 2 breaks
  const totalMins = leagueTotal + knockoutBreak + matchDuration + knockoutBreak + matchDuration
  
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">⏱️</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-blue-900">Tournament Timeline</h4>
        <p className="text-xs text-blue-700 mt-1">
          Starts at <strong>1:00 PM</strong> · Ends approx <strong>{formatTime(startTime, totalMins)}</strong> ({hours > 0 ? `${hours}h ` : ''}{mins}m total)
        </p>
      </div>
      <div className="text-[10px] font-bold text-blue-400 bg-white px-2 py-1 rounded border border-blue-100 uppercase">
        April 17, 2026
      </div>
    </div>
  )
}

export default function TournamentPanel({ isAdmin, pairs, stage, groups, groupMatches, semis, final, champion, onStart, onReset, onUpdate, onSetWinner }) {
  if (pairs.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 text-center py-16 text-slate-400">
        <div className="text-5xl mb-3">🎯</div>
        <p className="text-sm">Generate teams in the Pairing tab first</p>
      </div>
    )
  }

  const groupAComplete = groupMatches.A.length > 0 && groupMatches.A.every((m) => m.winner !== null)
  const groupBComplete = groupMatches.B.length > 0 && groupMatches.B.every((m) => m.winner !== null)
  
  const semiComplete = semis.length > 0 && semis.every((m) => m.winner !== null)
  const finalComplete = stage === 'champion'

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-10">

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {isAdmin && (
          <div className="flex items-center gap-3">
            {stage === 'idle' ? (
              <button 
                onClick={onStart} 
                disabled={pairs.length < 4}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  pairs.length < 4 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Start Tournament
              </button>
            ) : (
              <button onClick={onReset} className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Reset
              </button>
            )}
            {stage === 'idle' && pairs.length < 4 && (
              <span className="text-xs text-amber-600 font-medium">Need at least 4 teams</span>
            )}
          </div>
        )}

        {stage === 'groups' && (
          <div className="w-full sm:w-auto flex flex-col items-end gap-2">
            {groupAComplete && groupBComplete && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold animate-pulse">
                All Group Matches Complete! Knockout Stage Ready ↓
              </span>
            )}
          </div>
        )}
      </div>

      {/* Idle */}
      {stage === 'idle' && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-sm">{pairs.length} teams · 2 Groups → Semis → Final</p>
        </div>
      )}

      {/* Tournament Content */}
      {stage !== 'idle' && (
        <div className="space-y-16">
          {/* Timeline Helpers */}
          {(() => {
            const START = "2026-04-17T13:00:00"
            const M_DUR = 20
            const L_BRK = 10
            const K_BRK = 15

            const sortedRounds = [...new Set([...groupMatches.A, ...groupMatches.B].map(m => m.round))].sort()
            const leagueRoundsCount = sortedRounds.length
            const leagueEndTime = (leagueRoundsCount * M_DUR) + ((leagueRoundsCount - 1) * L_BRK)

            return (
              <>
                {/* Group Stage Schedule */}
                <div className="space-y-12">
                  <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>⚔️</span> Stage 1: Group Stage
                    </h2>
                    <ScheduleEstimator 
                      matchCount={groupMatches.A.length + groupMatches.B.length} 
                      courtCount={3} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <h3 className="text-lg font-bold text-slate-800">Group A Standings</h3>
                      </div>
                      <Leaderboard leaderboard={calculateStandings(groups.A, groupMatches.A)} pairs={pairs} />
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <h3 className="text-lg font-bold text-slate-800">Group B Standings</h3>
                      </div>
                      <Leaderboard leaderboard={calculateStandings(groups.B, groupMatches.B)} pairs={pairs} />
                    </div>
                  </div>

                  <div className="space-y-8 pt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📅</span>
                      <h3 className="text-lg font-bold text-slate-800">Official Schedule (3 Courts)</h3>
                    </div>
                    
                    <div className="space-y-10">
                      {sortedRounds.map((round, idx) => {
                        const matches = [...groupMatches.A, ...groupMatches.B].filter(m => m.round === round).sort((a,b) => a.court - b.court)
                        const isExtended = round > 4
                        const startTimeOffset = idx * (M_DUR + L_BRK)
                        
                        return (
                          <div key={round} className="space-y-4">
                            {idx > 0 && (
                              <div className="flex flex-col items-center py-2 animate-pulse">
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-400 my-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">☕ 10 MIN BREAK</span>
                                <div className="h-4 w-px bg-slate-200" />
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-slate-200" />
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Round {round}</h4>
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{formatTime(START, startTimeOffset)}</span>
                                </div>
                                {isExtended && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter">Reduced to 2 Courts</span>}
                              </div>
                              <div className="h-px flex-1 bg-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {matches.map((match) => (
                                <MatchCard
                                  key={match.id}
                                  match={match}
                                  pairs={pairs}
                                  stageKey={match.id.includes('group-A') ? 'group-A' : 'group-B'}
                                  label={`Court ${match.court} · Group ${match.id.includes('group-A') ? 'A' : 'B'}`}
                                  onUpdate={onUpdate}
                                  isAdmin={isAdmin}
                      onSetWinner={onSetWinner}
                                />
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Knockout Stage */}
                <div className="space-y-10 pt-10 border-t border-slate-200">
                  <div className="border-b border-slate-100 pb-2">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>🏆</span> Stage 2: Knockout Stage
                    </h2>
                  </div>

                  {/* SF Break */}
                  <div className="flex flex-col items-center py-4">
                    <div className="h-6 w-px bg-amber-200" />
                    <span className="text-xs font-black text-amber-600 my-2 bg-amber-50 px-4 py-1 rounded-full border border-amber-200 shadow-sm">🍿 15 MIN PRE-SEMI BREAK ({formatTime(START, leagueEndTime)})</span>
                    <div className="h-6 w-px bg-amber-200" />
                  </div>

                  {/* Semis */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">START: {formatTime(START, leagueEndTime + K_BRK)}</span>
                    </div>
                    <BracketSection
                      title="Semi Finals"
                      emoji="🎯"
                      matches={semis}
                      stageKey="semis"
                      pairs={pairs}
                      isActive={stage === 'semi'}
                      isComplete={semiComplete}
                      isPending={!stageReached(stage, 'semi')}
                      onUpdate={onUpdate}
                      isAdmin={isAdmin}
                      onSetWinner={onSetWinner}
                      gridCols="grid-cols-1 sm:grid-cols-2"
                    />
                  </div>

                  {/* Final Break */}
                  <div className="flex flex-col items-center py-4">
                    <div className="h-6 w-px bg-amber-200" />
                    <span className="text-xs font-black text-amber-600 my-2 bg-amber-50 px-4 py-1 rounded-full border border-amber-200 shadow-sm">🏆 15 MIN PRE-FINAL BREAK ({formatTime(START, leagueEndTime + K_BRK + M_DUR)})</span>
                    <div className="h-6 w-px bg-amber-200" />
                  </div>

                  {/* Final */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">START: {formatTime(START, leagueEndTime + K_BRK + M_DUR + K_BRK)}</span>
                    </div>
                    <BracketSection
                      title="Grand Final"
                      emoji="🏆"
                      matches={final ? [final] : []}
                      stageKey="final"
                      pairs={pairs}
                      isActive={stage === 'final'}
                      isComplete={finalComplete}
                      isPending={!stageReached(stage, 'final')}
                      onUpdate={onUpdate}
                      isAdmin={isAdmin}
                      onSetWinner={onSetWinner}
                      gridCols="grid-cols-1 max-w-md"
                    />
                  </div>

                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Champion Celebration Overlay */}
      {stage === 'champion' && (
        <CelebrationModal champion={champion} pairs={pairs} onReset={onReset} />
      )}
    </div>
  )
}
