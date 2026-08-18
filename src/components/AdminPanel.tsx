import { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Loader2, LogOut, Crown, AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { checkIsAdmin, claimAdmin } from '@/lib/adminApi';
import AdminDashboard from './AdminDashboard';

interface AdminPanelProps {
  onExit: () => void;
}

type GateState = 'checking' | 'unauthenticated' | 'not-admin' | 'no-admin-exists' | 'authorized';

export default function AdminPanel({ onExit }: AdminPanelProps) {
  const { session, loading: authLoading, signOut } = useAuth();
  const [gate, setGate] = useState<GateState>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      setGate('unauthenticated');
      return;
    }
    checkIsAdmin().then((admin) => {
      if (admin) {
        setGate('authorized');
      } else {
        // Check if any admin exists at all — if not, offer the bootstrap claim
        supabase
          .from('admins')
          .select('user_id', { count: 'exact', head: true })
          .then(({ count }) => {
            setGate(count === 0 ? 'no-admin-exists' : 'not-admin');
          });
      }
    });
  }, [session, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch {
      setLoginError('Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleClaim = async () => {
    setClaimError(null);
    setClaimLoading(true);
    try {
      const result = await claimAdmin();
      if (!result.ok) throw new Error(result.error);
      setGate('authorized');
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : 'Could not claim admin.');
    } finally {
      setClaimLoading(false);
    }
  };

  if (gate === 'checking' || authLoading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (gate === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
        <div className="absolute top-6 left-6">
          <button onClick={onExit} className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </button>
        </div>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 border border-gold-500/30 mb-4">
              <ShieldCheck className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="font-display font-bold uppercase text-2xl text-gray-100">Admin Access</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in with your admin account to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="card-surface p-6 space-y-4">
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="admin@zerobullet.gg" />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field" placeholder="••••••••" />
            </div>
            {loginError && <p className="text-sm text-ember-400">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="btn-gold w-full">
              {loginLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <><Lock className="w-4 h-4" /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (gate === 'no-admin-exists') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
        <div className="absolute top-6 left-6">
          <button onClick={onExit} className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </button>
        </div>
        <div className="w-full max-w-md text-center">
          <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 border border-gold-500/30 mb-4">
            <Crown className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-display font-bold uppercase text-2xl text-gray-100 mb-2">Claim Admin</h1>
          <p className="text-gray-400 text-sm mb-6">
            No admin has been set up yet. You're signed in as <span className="text-gold-400 font-semibold">{session?.user?.email}</span>.
            Click below to claim the first admin account. This can only be done once.
          </p>
          {claimError && (
            <div className="mb-4 p-3 bg-ember-500/10 border border-ember-500/30 rounded-lg text-sm text-ember-400">
              {claimError}
            </div>
          )}
          <button onClick={handleClaim} disabled={claimLoading} className="btn-gold w-full">
            {claimLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Claiming...</> : <><Crown className="w-4 h-4" /> Claim Admin</>}
          </button>
          <button onClick={signOut} className="btn-ghost w-full mt-3">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (gate === 'not-admin') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
        <div className="absolute top-6 left-6">
          <button onClick={onExit} className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </button>
        </div>
        <div className="w-full max-w-md text-center">
          <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-ember-500/10 border border-ember-500/30 mb-4">
            <AlertTriangle className="w-8 h-8 text-ember-500" />
          </div>
          <h1 className="font-display font-bold uppercase text-2xl text-gray-100 mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-6">
            You're signed in as <span className="text-gold-400 font-semibold">{session?.user?.email}</span>, but this account does not have admin privileges.
          </p>
          <button onClick={signOut} className="btn-ghost w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onExit={onExit} onSignOut={signOut} />;
}
