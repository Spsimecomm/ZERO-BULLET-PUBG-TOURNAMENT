import { useEffect, useState } from 'react';
import { LogOut, ArrowLeft, ClipboardList, Trophy, Gamepad2, Users, RefreshCw } from 'lucide-react';
import Logo from './Logo';
import RegistrationsTab from './admin/RegistrationsTab';
import LeaderboardTab from './admin/LeaderboardTab';
import TournamentsTab from './admin/TournamentsTab';
import { fetchRegistrations, fetchTournamentsAdmin, fetchLeaderboardAdmin } from '@/lib/adminApi';
import type { Registration, Tournament, LeaderboardEntry } from '@/lib/supabase';

interface AdminDashboardProps {
  onExit: () => void;
  onSignOut: () => void;
}

type Tab = 'registrations' | 'leaderboard' | 'tournaments';

export default function AdminDashboard({ onExit, onSignOut }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [regs, tourns, lb] = await Promise.all([
        fetchRegistrations(),
        fetchTournamentsAdmin(),
        fetchLeaderboardAdmin(),
      ]);
      setRegistrations(regs);
      setTournaments(tourns);
      setLeaderboard(lb);
    } catch {
      // ignore — tables may be empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const tabs = [
    { id: 'registrations' as Tab, label: 'Registrations', icon: ClipboardList, badge: pendingCount },
    { id: 'leaderboard' as Tab, label: 'Leaderboard', icon: Trophy, badge: 0 },
    { id: 'tournaments' as Tab, label: 'Tournaments', icon: Gamepad2, badge: 0 },
  ];

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-ink-900/90 backdrop-blur-md border-b border-ink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={onExit} className="p-2 text-gray-400 hover:text-gold-400 hover:bg-ink-700 rounded-lg transition-colors" aria-label="Back to site">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Logo />
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-display font-semibold uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/30 rounded-full">
                <Users className="w-3 h-3" /> Admin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refresh} className="p-2 text-gray-400 hover:text-gold-400 hover:bg-ink-700 rounded-lg transition-colors" aria-label="Refresh">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={onSignOut} className="btn-ghost text-sm py-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-ink-700 bg-ink-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 font-display font-medium uppercase tracking-wider text-sm whitespace-nowrap transition-colors ${
                    active ? 'text-gold-400' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.badge > 0 && (
                    <span className="ml-1 grid place-items-center min-w-5 h-5 px-1.5 rounded-full bg-ember-500 text-ink-950 text-xs font-bold">
                      {t.badge}
                    </span>
                  )}
                  {active && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold-gradient" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'registrations' && (
          <RegistrationsTab registrations={registrations} tournaments={tournaments} loading={loading} onChanged={refresh} />
        )}
        {tab === 'leaderboard' && (
          <LeaderboardTab entries={leaderboard} tournaments={tournaments} loading={loading} onChanged={refresh} />
        )}
        {tab === 'tournaments' && (
          <TournamentsTab tournaments={tournaments} loading={loading} onChanged={refresh} />
        )}
      </main>
    </div>
  );
}
