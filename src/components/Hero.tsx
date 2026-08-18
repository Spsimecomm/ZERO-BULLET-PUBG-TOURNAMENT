import { Calendar, Clock, Zap } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';

interface HeroProps {
  nextMatchTitle: string;
  nextMatchDate: string;
  totalPrizePool: number;
  activePlayers: number;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-ink-800/90 border border-gold-500/30 backdrop-blur-sm">
        <span className="font-mono font-bold text-2xl sm:text-3xl text-gradient-gold tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 font-display text-xs uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );
}

export default function Hero({ nextMatchTitle, nextMatchDate, totalPrizePool, activePlayers }: HeroProps) {
  const time = useCountdown(nextMatchDate);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
      </div>

      {/* Glow accents */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-ember-500/20 blur-3xl animate-glow" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-gold-500/15 blur-3xl animate-glow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="max-w-3xl">
          <div className="section-label mb-6">
            <Zap className="w-3.5 h-3.5" />
            PUBG Mobile Esports
          </div>

          <h1 className="font-display font-bold uppercase leading-[0.95] text-5xl sm:text-6xl lg:text-7xl tracking-tight">
            <span className="text-gray-100">Battle.</span>{' '}
            <span className="text-gradient-gold">Dominate.</span>
            <br />
            <span className="text-gray-100">Win the</span>{' '}
            <span className="text-gradient-gold">War.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
            Join ZeroBullet Tournaments — the ultimate PUBG Mobile battleground. Compete in Solo, Duo, and Squad modes for real prize pools and climb the leaderboard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#tournaments" className="btn-gold animate-pulse-gold">
              <Zap className="w-5 h-5" />
              Join Tournament
            </a>
            <a href="#leaderboard" className="btn-ghost">
              View Leaderboard
            </a>
          </div>

          {/* Countdown */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4 text-gold-400">
              <Clock className="w-4 h-4" />
              <span className="font-display text-sm uppercase tracking-widest">
                Next Match: {nextMatchTitle}
              </span>
            </div>
            <div className="flex gap-3 sm:gap-5">
              {time ? (
                <>
                  <Unit value={time.days} label="Days" />
                  <span className="font-mono text-3xl text-gold-500/50 self-start mt-3">:</span>
                  <Unit value={time.hours} label="Hours" />
                  <span className="font-mono text-3xl text-gold-500/50 self-start mt-3">:</span>
                  <Unit value={time.minutes} label="Mins" />
                  <span className="font-mono text-3xl text-gold-500/50 self-start mt-3">:</span>
                  <Unit value={time.seconds} label="Secs" />
                </>
              ) : (
                <p className="font-display text-lg text-gold-400 uppercase tracking-wider">Match is live now!</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            <div className="card-surface p-4">
              <Calendar className="w-5 h-5 text-gold-400 mb-2" />
              <p className="font-display text-2xl font-bold text-gray-100">{activePlayers}+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Active Players</p>
            </div>
            <div className="card-surface p-4">
              <Zap className="w-5 h-5 text-gold-400 mb-2" />
              <p className="font-display text-2xl font-bold text-gradient-gold">৳{totalPrizePool.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Prize Pool</p>
            </div>
            <div className="card-surface p-4">
              <Clock className="w-5 h-5 text-gold-400 mb-2" />
              <p className="font-display text-2xl font-bold text-gray-100">24/7</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Live Matches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink-950 to-transparent pointer-events-none" />
    </section>
  );
}
