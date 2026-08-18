import { supabase } from './supabase';
import type { Tournament, Registration, LeaderboardEntry, TournamentMode, TournamentMap, TournamentStatus } from './supabase';

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data === true;
}

export async function claimAdmin(): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.rpc('claim_admin');
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function fetchRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Registration[]) || [];
}

export async function approveRegistration(id: string): Promise<void> {
  const { error } = await supabase.rpc('admin_approve_registration', { p_id: id });
  if (error) throw error;
}

export async function rejectRegistration(id: string): Promise<void> {
  const { error } = await supabase.rpc('admin_reject_registration', { p_id: id });
  if (error) throw error;
}

export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase.from('registrations').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchTournamentsAdmin(): Promise<Tournament[]> {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('starts_at', { ascending: true });
  if (error) throw error;
  return (data as Tournament[]) || [];
}

export interface TournamentInput {
  title: string;
  mode: TournamentMode;
  map: TournamentMap;
  prize_pool: number;
  entry_fee: number;
  starts_at: string;
  status: TournamentStatus;
  slots_total: number;
  slots_filled: number;
  image_url: string | null;
}

export async function createTournament(input: TournamentInput): Promise<void> {
  const { error } = await supabase.from('tournaments').insert(input);
  if (error) throw error;
}

export async function updateTournament(id: string, patch: Partial<TournamentInput>): Promise<void> {
  const { error } = await supabase.from('tournaments').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteTournament(id: string): Promise<void> {
  const { error } = await supabase.from('tournaments').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchLeaderboardAdmin(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .order('rank', { ascending: true });
  if (error) throw error;
  return (data as LeaderboardEntry[]) || [];
}

export interface LeaderboardInput {
  tournament_id: string;
  rank: number;
  team_name: string;
  kills: number;
  total_points: number;
}

export async function addLeaderboardEntry(input: LeaderboardInput): Promise<void> {
  const { error } = await supabase.from('leaderboard_entries').insert(input);
  if (error) throw error;
}

export async function updateLeaderboardEntry(id: string, patch: Partial<LeaderboardInput>): Promise<void> {
  const { error } = await supabase.from('leaderboard_entries').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteLeaderboardEntry(id: string): Promise<void> {
  const { error } = await supabase.from('leaderboard_entries').delete().eq('id', id);
  if (error) throw error;
}
