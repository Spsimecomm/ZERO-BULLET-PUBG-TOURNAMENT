import { useState } from 'react';
import { Plus, Trash2, Loader2, Gamepad2, Check, X, Map, Users, Trophy, Ticket, Clock, Pencil, Image as ImageIcon } from 'lucide-react';
import type { Tournament, TournamentMode, TournamentMap, TournamentStatus } from '@/lib/supabase';
import { createTournament, updateTournament, deleteTournament } from '@/lib/adminApi';

interface Props {
  tournaments: Tournament[];
  loading: boolean;
  onChanged: () => void;
}

const modes: TournamentMode[] = ['Solo', 'Duo', 'Squad'];
const maps: TournamentMap[] = ['Erangel', 'Sanhok', 'Miramar', 'Karakin'];
const statuses: TournamentStatus[] = ['upcoming', 'live', 'completed'];

const modeStyles: Record<string, string> = {
  Solo: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  Duo: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Squad: 'text-gold-400 border-gold-400/30 bg-gold-400/10',
};

const statusStyles: Record<string, string> = {
  upcoming: 'text-gold-400 border-gold-400/30 bg-gold-400/10',
  live: 'text-red-400 border-red-400/30 bg-red-400/10',
  completed: 'text-gray-400 border-ink-500 bg-ink-700/50',
};

interface FormState {
  title: string;
  mode: TournamentMode;
  map: TournamentMap;
  prize_pool: number;
  entry_fee: number;
  starts_at: string;
  status: TournamentStatus;
  slots_total: number;
  slots_filled: number;
  image_url: string;
}

export default function TournamentsTab({ tournaments, loading, onChanged }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const defaultDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
  const blank: FormState = {
    title: '',
    mode: 'Squad',
    map: 'Erangel',
    prize_pool: 5000,
    entry_fee: 50,
    starts_at: defaultDate,
    status: 'upcoming',
    slots_total: 100,
    slots_filled: 0,
    image_url: '',
  };
  const [form, setForm] = useState<FormState>(blank);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Tournament title is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createTournament({
        title: form.title.trim(),
        mode: form.mode,
        map: form.map,
        prize_pool: form.prize_pool,
        entry_fee: form.entry_fee,
        starts_at: new Date(form.starts_at).toISOString(),
        status: form.status,
        slots_total: form.slots_total,
        slots_filled: form.slots_filled,
        image_url: form.image_url.trim() || null,
      });
      setShowForm(false);
      setForm(blank);
      onChanged();
    } catch {
      setError('Could not create tournament. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t: Tournament) => {
    setEditingId(t.id);
    setEditForm({
      title: t.title,
      mode: t.mode,
      map: t.map,
      prize_pool: t.prize_pool,
      entry_fee: t.entry_fee,
      starts_at: new Date(t.starts_at).toISOString().slice(0, 16),
      status: t.status,
      slots_total: t.slots_total,
      slots_filled: t.slots_filled,
      image_url: t.image_url || '',
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editForm) return;
    if (!editForm.title.trim()) {
      setError('Tournament title is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateTournament(editingId, {
        title: editForm.title.trim(),
        mode: editForm.mode,
        map: editForm.map,
        prize_pool: editForm.prize_pool,
        entry_fee: editForm.entry_fee,
        starts_at: new Date(editForm.starts_at).toISOString(),
        status: editForm.status,
        slots_total: editForm.slots_total,
        slots_filled: editForm.slots_filled,
        image_url: editForm.image_url.trim() || null,
      });
      cancelEdit();
      onChanged();
    } catch {
      setError('Could not update tournament. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tournament? All related registrations and leaderboard entries will also be deleted.')) return;
    setDeletingId(id);
    try { await deleteTournament(id); onChanged(); } catch { /* ignore */ } finally { setDeletingId(null); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{tournaments.length} tournaments</p>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setError(null); }} className="btn-gold text-sm py-2">
            <Plus className="w-4 h-4" /> New Tournament
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="card-surface p-5 space-y-4">
          <h3 className="font-display font-bold uppercase tracking-wide text-gray-100">Create New Tournament</h3>
          <TournamentFormFields form={form} setForm={setForm} />
          {error && <p className="text-sm text-ember-400">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-gold flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Create
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tournament list */}
      {tournaments.length === 0 && !showForm ? (
        <div className="card-surface p-12 text-center">
          <Gamepad2 className="w-10 h-10 text-gold-500 mx-auto mb-4" />
          <p className="font-display text-xl text-gray-300 uppercase tracking-wide">No tournaments</p>
          <p className="text-gray-500 mt-2">Create your first tournament to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="card-surface p-5">
              {/* Thumbnail preview */}
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden border border-ink-700">
                <img
                  src={t.image_url || 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg'}
                  alt={t.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-xs text-gray-300 font-medium">
                    {t.image_url ? 'Custom image' : 'Default image'}
                  </span>
                </div>
              </div>

              {editingId === t.id && editForm ? (
                /* === Inline edit form === */
                <form onSubmit={handleUpdate} className="space-y-3">
                  <h3 className="font-display font-bold uppercase tracking-wide text-sm text-gold-400">Edit Tournament</h3>
                  <TournamentFormFields form={editForm} setForm={setEditForm} />
                  {error && <p className="text-sm text-ember-400">{error}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="btn-gold flex-1 text-sm py-2">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn-ghost flex-1 text-sm py-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* === Display mode === */
                <>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-gray-100">{t.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs font-display font-semibold uppercase tracking-wider rounded border ${modeStyles[t.mode]}`}>
                          {t.mode}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-display font-semibold uppercase tracking-wider rounded border ${statusStyles[t.status]}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(t)}
                        className="p-2 text-gray-400 hover:text-gold-400 hover:bg-ink-700 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        className="p-2 text-gray-400 hover:text-ember-500 hover:bg-ink-700 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Delete"
                      >
                        {deletingId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><Map className="w-4 h-4 text-gold-500" /> {t.map}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gold-500" /> {t.slots_filled}/{t.slots_total}</div>
                    <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-gold-500" /> ৳{t.prize_pool.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><Ticket className="w-4 h-4 text-gold-500" /> ৳{t.entry_fee}</div>
                    <div className="flex items-center gap-2 col-span-2"><Clock className="w-4 h-4 text-gold-500" /> {new Date(t.starts_at).toLocaleString()}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* === Shared form fields === */
function TournamentFormFields({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Title</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. ZeroBullet Weekend Clash" />
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Mode</label>
        <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as TournamentMode })} className="input-field">
          {modes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Map</label>
        <select value={form.map} onChange={(e) => setForm({ ...form, map: e.target.value as TournamentMap })} className="input-field">
          {maps.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Prize Pool (৳)</label>
        <input type="number" min={0} value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: parseInt(e.target.value) || 0 })} className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Entry Fee (৳)</label>
        <input type="number" min={0} value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: parseInt(e.target.value) || 0 })} className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Start Time</label>
        <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TournamentStatus })} className="input-field">
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Total Slots</label>
        <input type="number" min={1} value={form.slots_total} onChange={(e) => setForm({ ...form, slots_total: parseInt(e.target.value) || 100 })} className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Slots Filled</label>
        <input type="number" min={0} max={form.slots_total} value={form.slots_filled} onChange={(e) => setForm({ ...form, slots_filled: parseInt(e.target.value) || 0 })} className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Image URL (poster / thumbnail)
          </span>
        </label>
        <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://images.pexels.com/..." />
        {form.image_url && (
          <div className="mt-2 relative h-20 rounded-lg overflow-hidden border border-ink-700">
            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">Paste a direct link to an image. Leave empty to use the default gaming poster.</p>
      </div>
    </div>
  );
}
