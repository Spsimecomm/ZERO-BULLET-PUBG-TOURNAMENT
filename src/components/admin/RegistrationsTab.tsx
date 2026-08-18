import { useState } from 'react';
import { Check, X, Trash2, Loader2, Search, CreditCard, Hash, Phone, Users, Gamepad2 } from 'lucide-react';
import type { Registration, Tournament } from '@/lib/supabase';
import { approveRegistration, rejectRegistration, deleteRegistration } from '@/lib/adminApi';

interface Props {
  registrations: Registration[];
  tournaments: Tournament[];
  loading: boolean;
  onChanged: () => void;
}

const statusStyles: Record<string, string> = {
  pending: 'text-ember-400 bg-ember-500/10 border-ember-500/30',
  confirmed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  rejected: 'text-gray-500 bg-ink-700 border-ink-500',
};

export default function RegistrationsTab({ registrations, tournaments, loading, onChanged }: Props) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const tournTitle = (id: string) => tournaments.find((t) => t.id === id)?.title || 'Unknown';

  const filtered = registrations.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.team_name.toLowerCase().includes(q) ||
        r.leader_name.toLowerCase().includes(q) ||
        r.pubg_id.toLowerCase().includes(q) ||
        r.whatsapp.toLowerCase().includes(q) ||
        r.transaction_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = async (id: string) => {
    setActionId(id);
    try { await approveRegistration(id); onChanged(); } catch { /* ignore */ } finally { setActionId(null); }
  };

  const handleReject = async (id: string) => {
    setActionId(id);
    try { await rejectRegistration(id); onChanged(); } catch { /* ignore */ } finally { setActionId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this registration permanently?')) return;
    setActionId(id);
    try { await deleteRegistration(id); onChanged(); } catch { /* ignore */ } finally { setActionId(null); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>;
  }

  if (registrations.length === 0) {
    return (
      <div className="card-surface p-12 text-center">
        <Users className="w-10 h-10 text-gold-500 mx-auto mb-4" />
        <p className="font-display text-xl text-gray-300 uppercase tracking-wide">No registrations yet</p>
        <p className="text-gray-500 mt-2">Teams that register for tournaments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team, leader, PUBG ID, WhatsApp, txn ID..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-1 bg-ink-800 border border-ink-600 rounded-lg p-1">
          {(['all', 'pending', 'confirmed', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md font-display text-xs uppercase tracking-wider transition-colors ${
                filter === f ? 'bg-gold-500/15 text-gold-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-100">{r.team_name}</h3>
                <p className="text-sm text-gray-500">{tournTitle(r.tournament_id)}</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-display font-semibold uppercase tracking-wider rounded-md border ${statusStyles[r.status]}`}>
                {r.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="truncate">{r.leader_name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Gamepad2 className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="truncate font-mono">{r.pubg_id}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="truncate">{r.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CreditCard className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="truncate">{r.payment_method}: {r.payment_number}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 col-span-2">
                <Hash className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="truncate font-mono text-xs">{r.transaction_id}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {r.status !== 'confirmed' && (
                <button
                  onClick={() => handleApprove(r.id)}
                  disabled={actionId === r.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-display text-sm font-semibold uppercase tracking-wider text-ink-950 bg-emerald-500 hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  {actionId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Approve
                </button>
              )}
              {r.status !== 'rejected' && (
                <button
                  onClick={() => handleReject(r.id)}
                  disabled={actionId === r.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-display text-sm font-semibold uppercase tracking-wider text-gray-200 bg-ink-700 border border-ink-500 hover:border-ember-500/50 hover:text-ember-400 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                disabled={actionId === r.id}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-gray-400 bg-ink-700 border border-ink-500 hover:text-ember-500 hover:border-ember-500/50 transition-colors disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">No registrations match your filter.</p>
      )}
    </div>
  );
}
