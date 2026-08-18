import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TournamentMode = 'Solo' | 'Duo' | 'Squad';
export type TournamentMap = 'Erangel' | 'Sanhok' | 'Miramar' | 'Karakin';
export type TournamentStatus = 'upcoming' | 'live' | 'completed';
export type PaymentMethod = 'bKash' | 'Nagad';

export interface Tournament {
  id: string;
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
  created_at: string;
}

export interface Registration {
  id: string;
  tournament_id: string;
  team_name: string;
  leader_name: string;
  pubg_id: string;
  whatsapp: string;
  payment_method: PaymentMethod;
  payment_number: string;
  transaction_id: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  tournament_id: string;
  rank: number;
  team_name: string;
  kills: number;
  total_points: number;
  created_at: string;
}

export interface RegistrationInput {
  tournament_id: string;
  team_name: string;
  leader_name: string;
  pubg_id: string;
  whatsapp: string;
  payment_method: PaymentMethod;
  payment_number: string;
  transaction_id: string;
}
