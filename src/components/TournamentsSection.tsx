import { Flame } from 'lucide-react';
import TournamentCard from './TournamentCard';
import type { Tournament } from '@/lib/supabase';

interface TournamentsSectionProps {
  tournaments: Tournament[];
  loading: boolean;
  onRegister: (tournament: Tournament) => void;
}

export default function TournamentsSection({ tournaments, loading, onRegister }: TournamentsSectionProps) {
  return (
    <section id="tournaments" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="section-label mb-4">
              <Flame className="w-3.5 h-3.5" />
              Active Tournaments
            </div>
            <h2 className="font-display font-bold uppercase text-4xl lg:text-5xl tracking-tight text-gray-100">
              Choose Your <span className="text-gradient-gold">Battlefield</span>
            </h2>
            <p className="mt-3 text-gray-400 max-w-xl">
              Pick a tournament, pay the entry fee via bKash or Nagad, and secure your slot. Limited seats per match.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-surface h-96 animate-pulse">
                <div className="h-44 bg-ink-700" />
                <div className="p-5 space-y-4">
                  <div className="h-5 w-2/3 bg-ink-700 rounded" />
                  <div className="h-4 w-1/2 bg-ink-700 rounded" />
                  <div className="h-2 w-full bg-ink-700 rounded" />
                  <div className="h-10 w-full bg-ink-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Flame className="w-10 h-10 text-gold-500 mx-auto mb-4" />
            <p className="font-display text-xl text-gray-300 uppercase tracking-wide">No active tournaments right now</p>
            <p className="text-gray-500 mt-2">Check back soon — new matches are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} onRegister={onRegister} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
