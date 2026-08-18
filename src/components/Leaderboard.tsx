import { Trophy, Medal, Crown, Skull } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/supabase';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  loading: boolean;
}

function rankBadge(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-gold-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-ember-500" />;
  return <span className="font-mono font-bold text-gray-400">{rank}</span>;
}

export default function Leaderboard({ entries, loading }: LeaderboardProps) {
  return (
    <section id="leaderboard" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/40 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="section-label mb-4 mx-auto">
            <Trophy className="w-3.5 h-3.5" />
            Results & Rankings
          </div>
          <h2 className="font-display font-bold uppercase text-4xl lg:text-5xl tracking-tight text-gray-100">
            Tournament <span className="text-gradient-gold">Leaderboard</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Final standings from completed matches. Top teams earn points based on kills and survival placement.
          </p>
        </div>

        {loading ? (
          <div className="card-surface p-8 animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-ink-700 rounded" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Trophy className="w-10 h-10 text-gold-500 mx-auto mb-4" />
            <p className="font-display text-xl text-gray-300 uppercase tracking-wide">No results yet</p>
            <p className="text-gray-500 mt-2">Completed tournament results will appear here.</p>
          </div>
        ) : (
          <div className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-ink-900 border-b border-ink-600">
                    <th className="px-4 sm:px-6 py-4 text-left font-display text-xs uppercase tracking-widest text-gold-400 w-20">Rank</th>
                    <th className="px-4 sm:px-6 py-4 text-left font-display text-xs uppercase tracking-widest text-gold-400">Team Name</th>
                    <th className="px-4 sm:px-6 py-4 text-right font-display text-xs uppercase tracking-widest text-gold-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5" /> Kills
                      </span>
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-right font-display text-xs uppercase tracking-widest text-gold-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" /> Points
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr
                      key={e.id}
                      className={`border-b border-ink-700 transition-colors hover:bg-ink-700/50 ${
                        e.rank <= 3 ? 'bg-gold-500/5' : ''
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {rankBadge(e.rank)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`font-display font-semibold tracking-wide ${e.rank === 1 ? 'text-gold-400' : 'text-gray-200'}`}>
                          {e.team_name}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <span className="font-mono font-semibold text-gray-300 tabular-nums">{e.kills}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <span className={`font-mono font-bold tabular-nums ${e.rank === 1 ? 'text-gold-400' : 'text-gray-200'}`}>
                          {e.total_points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
