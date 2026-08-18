import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TournamentsSection from '@/components/TournamentsSection';
import Leaderboard from '@/components/Leaderboard';
import RulesSection from '@/components/RulesSection';
import Footer from '@/components/Footer';
import RegistrationModal from '@/components/RegistrationModal';
import LoginModal from '@/components/LoginModal';
import AdminPanel from '@/components/AdminPanel';
import { supabase, type Tournament, type LeaderboardEntry } from '@/lib/supabase';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

export default function App() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const [registerTarget, setRegisterTarget] = useState<Tournament | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const hash = useHashRoute();
  const isAdminRoute = hash === '#/admin' || hash === '#admin';

  useEffect(() => {
    (async () => {
      const { data: tData } = await supabase
        .from('tournaments')
        .select('*')
        .order('starts_at', { ascending: true });
      setTournaments((tData as Tournament[]) || []);
      setLoadingTournaments(false);

      const { data: lData } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('rank', { ascending: true });
      setLeaderboard((lData as LeaderboardEntry[]) || []);
      setLoadingLeaderboard(false);
    })();
  }, []);

  const nextMatch = tournaments[0];
  const totalPrize = tournaments.reduce((sum, t) => sum + t.prize_pool, 0);

  const handleRegistered = () => {
    (async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .order('starts_at', { ascending: true });
      if (data) setTournaments(data as Tournament[]);
    })();
  };

  const exitAdmin = () => {
    window.location.hash = '';
  };

  if (isAdminRoute) {
    return <AdminPanel onExit={exitAdmin} />;
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar onLoginClick={() => setLoginOpen(true)} />

      <main>
        <Hero
          nextMatchTitle={nextMatch?.title || 'TBA'}
          nextMatchDate={nextMatch?.starts_at || new Date(Date.now() + 86400000).toISOString()}
          totalPrizePool={totalPrize}
          activePlayers={3200}
        />

        <TournamentsSection
          tournaments={tournaments}
          loading={loadingTournaments}
          onRegister={(t) => setRegisterTarget(t)}
        />

        <Leaderboard entries={leaderboard} loading={loadingLeaderboard} />

        <RulesSection />
      </main>

      <Footer />

      <RegistrationModal
        tournament={registerTarget}
        onClose={() => setRegisterTarget(null)}
        onSubmitted={handleRegistered}
      />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
