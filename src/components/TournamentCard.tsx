import { Users, Map, Trophy, Ticket, Clock, Zap, Gamepad2 } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import type { Tournament } from '@/lib/supabase';

interface TournamentCardProps {
  tournament: Tournament;
  onRegister: (tournament: Tournament) => void;
}

const modeStyles: Record<string, string> = {
  Solo: 'text-sky-400 border-sky-400/40 bg-sky-400/15',
  Duo: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/15',
  Squad: 'text-gold-400 border-gold-400/40 bg-gold-400/15',
};

const modeGlow: Record<string, string> = {
  Solo: 'shadow-[0_0_12px_rgba(56,189,248,0.4)]',
  Duo: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]',
  Squad: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
};

function MiniCountdown({ startsAt }: { startsAt: string }) {
  const time = useCountdown(startsAt);
  if (!time) return <span className="text-red-400 font-display font-bold text-xs">LIVE NOW</span>;
  if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0)
    return <span className="text-red-400 font-display font-bold text-xs">LIVE NOW</span>;
  return (
    <span className="font-mono text-xs text-white tabular-nums font-semibold">
      {time.days > 0 && `${time.days}d `}
      {String(time.hours).padStart(2, '0')}h {String(time.minutes).padStart(2, '0')}m {String(time.seconds).padStart(2, '0')}s
    </span>
  );
}

export default function TournamentCard({ tournament, onRegister }: TournamentCardProps) {
  const filledPct = Math.round((tournament.slots_filled / tournament.slots_total) * 100);
  const isFull = tournament.slots_filled >= tournament.slots_total;
  const isLive = tournament.status === 'live';
  const isUpcoming = tournament.status === 'upcoming';
  const fallbackImage = 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg';

  return (
    <div className="card-surface group hover:border-gold-500/50 hover:shadow-gold hover:-translate-y-1 flex flex-col overflow-hidden">
      {/* === Thumbnail / Poster area === */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tournament.image_url || fallbackImage}
          alt={tournament.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/60 via-transparent to-transparent" />

        {/* Scanline / gaming texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 3px)',
          }}
        />

        {/* Top-left: Mode badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-md border backdrop-blur-sm ${modeStyles[tournament.mode]} ${modeGlow[tournament.mode]}`}>
            {tournament.mode}
          </span>
        </div>

        {/* Top-right: Countdown / Live badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-ink-950/90 backdrop-blur-md rounded-md border border-ink-500">
          {isLive ? (
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 font-display font-bold text-xs uppercase">Live</span>
            </span>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <MiniCountdown startsAt={tournament.starts_at} />
            </>
          )}
        </div>

        {/* Bottom-left: Title overlay on thumbnail (YouTube style) */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-display font-semibold uppercase tracking-widest text-gold-400">{tournament.map}</span>
          </div>
          <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white drop-shadow-lg leading-tight">
            {tournament.title}
          </h3>
        </div>

        {/* Prize pool ribbon (YouTube thumbnail style) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-gradient-to-l from-gold-500 to-gold-600 px-3 py-1.5 rounded-l-lg shadow-lg">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-ink-900" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-ink-900/70">Prize</span>
              <span className="text-sm font-display font-extrabold text-ink-900">৳{tournament.prize_pool.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === Details area === */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-ink-800/50 border border-ink-700">
            <Map className="w-4 h-4 text-gold-500" />
            <span className="text-xs text-gray-300 font-medium">{tournament.map}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-ink-800/50 border border-ink-700">
            <Users className="w-4 h-4 text-gold-500" />
            <span className="text-xs text-gray-300 font-medium">{tournament.slots_total} Slots</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-ink-800/50 border border-ink-700">
            <Ticket className="w-4 h-4 text-gold-500" />
            <span className="text-xs text-gray-300 font-medium">৳{tournament.entry_fee}</span>
          </div>
        </div>

        {/* Slots progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500 font-medium uppercase tracking-wider">Slots Filled</span>
            <span className="text-gray-300 font-semibold">{tournament.slots_filled}/{tournament.slots_total}</span>
          </div>
          <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-gold-500 to-gold-400'}`}
              style={{ width: `${filledPct}%` }}
            />
          </div>
          <div className="mt-1 text-right">
            <span className={`text-xs font-semibold ${isFull ? 'text-red-400' : filledPct > 75 ? 'text-orange-400' : 'text-gold-400'}`}>
              {isFull ? 'FULL' : `${filledPct}% filled`}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-1 flex items-end">
          <button
            onClick={() => onRegister(tournament)}
            disabled={isFull}
            className={`w-full ${isFull ? 'btn-ghost cursor-not-allowed opacity-60' : 'btn-gold'} ${isUpcoming ? '' : 'opacity-70'}`}
          >
            {isFull ? 'Slots Full' : (
              <>
                <Zap className="w-4 h-4" />
                Register Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
