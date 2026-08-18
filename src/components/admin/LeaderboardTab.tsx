import { useState } from 'react';
import { Plus, Trash2, Loader2, Trophy, Pencil, Check, X } from 'lucide-react';
import type { LeaderboardEntry, Tournament } from '@/lib/supabase';
import { addLeaderboardEntry, updateLeaderboardEntry, deleteLeaderboardEntry } from '@/lib/adminApi';

interface Props {
  entries: LeaderboardEntry[];
  tournaments: Tournament[];
  loading: boolean;
  onChanged: () => void;
}

export default function LeaderboardTab({ entries, tournaments, loading, onChanged }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blank = { tournament_id: tournaments[0]?.id || '', rank: 1, team_name: '', kills: 0, total_points: 0 };
  const [form, setForm] = useState(blank);

  const tournTitle = (id: string) => tournaments.find((t) => t.id === id)?.title || 'Unknown';

  const startAdd = () => {
    setForm({ ...blank, tournament_id: tournaments[0]?.id || '' });
    setEditingId(null);
    setError(null);
    setShowForm(true);
  };

  const startEdit = (e: LeaderboardEntry) => {
    setForm({ tournament_id: e.tournament_id, rank: e.rank, team_name: e.team_name, kills: e.kills, total_points: e.total_points });
    setEditingId(e.id);
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tournament_id || !form.team_name.trim()) {
      setError('Tournament and team name are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateLeaderboardEntry(editingId, form);
      } else {
        await addLeaderboardEntry(form);
      }
      setShowForm(false);
      onChanged();
    } catch {
      setError('Could not save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this leaderboard entry?')) return;
    try { await deleteLeaderboardEntry(id); onChanged(); } catch { /* ignore */ }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{entries.length} entries</p>
        {!showForm && (
          <button onClick={startAdd} className="btn-gold text-sm py-2">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface p-5 space-y-4">
          <h3 className="font-display font-bold uppercase tracking-wide text-gray-100">
            {editingId ? 'Edit Entry' : 'New Leaderboard Entry'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Tournament</label>
              <select
                value={form.tournament_id}
                onChange={(e) => setForm({ ...form, tournament_id: e.target.value })}
                className="input-field"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Team Name</label>
              <input type="text" value={form.team_name} onChange={(e) => setForm({ ...form, team_name: e.target.value })} className="input-field" placeholder="e.g. Phoenix Esports" />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Rank</label>
              <input type="number" min={1} value={form.rank} onChange={(e) => setForm({ ...form, rank: parseInt(e.target.value) || 1 })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Kills</label>
              <input type="number" min={0} value={form.kills} onChange={(e) => setForm({ ...form, kills: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Total Points</label>
              <input type="number" min={0} value={form.total_points} onChange={(e) => setForm({ ...form, total_points: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
          </div>
          {error && <p className="text-sm text-ember-400">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-gold flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editingId ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="card-surface p-12 text-center">
          <Trophy className="w-10 h-10 text-gold-500 mx-auto mb-4" />
          <p className="font-display text-xl text-gray-300 uppercase tracking-wide">No leaderboard entries</p>
          <p className="text-gray-500 mt-2">Add results from completed tournaments.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ink-900 border-b border-ink-600">
                  <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-widest text-gold-400">Rank</th>
                  <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-widest text-gold-400">Team</th>
                  <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-widest text-gold-400 hidden sm:table-cell">Tournament</th>
                  <th className="px-4 py-3 text-right font-display text-xs uppercase tracking-widest text-gold-400">Kills</th>
                  <th className="px-4 py-3 text-right font-display text-xs uppercase tracking-widest text-gold-400">Points</th>
                  <th className="px-4 py-3 text-right font-display text-xs uppercase tracking-widest text-gold-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-ink-700 hover:bg-ink-700/40">
                    <td className="px-4 py-3 font-mono font-bold text-gold-400">{e.rank}</td>
                    <td className="px-4 py-3 font-display font-semibold text-gray-200">{e.team_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{tournTitle(e.tournament_id)}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-300 tabular-nums">{e.kills}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-200 tabular-nums">{e.total_points}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => startEdit(e)} className="p-2 text-gray-400 hover:text-gold-400 hover:bg-ink-700 rounded-lg transition-colors" aria-label="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(e.id)} className="p-2 text-gray-400 hover:text-ember-500 hover:bg-ink-700 rounded-lg transition-colors" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
