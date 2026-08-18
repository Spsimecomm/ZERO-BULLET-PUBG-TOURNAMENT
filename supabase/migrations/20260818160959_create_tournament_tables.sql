/*
# ZeroBullet Tournaments — schema

1. New Tables
- `tournaments` — list of PUBG Mobile tournaments (mode, map, prize pool, entry fee, start time, slots).
- `registrations` — teams registering for a tournament (team name, leader, PUBG ID, WhatsApp, payment info).
- `leaderboard_entries` — results for completed matches (rank, team name, kills, total points).
2. Security
- This is a single-tenant, no-auth public site. RLS enabled on all tables.
- All tables allow anon + authenticated CRUD because the data is intentionally public/shared.
3. Notes
- Seed data is inserted for tournaments and leaderboard entries so the site renders with content.
*/

CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('Solo','Duo','Squad')),
  map text NOT NULL CHECK (map IN ('Erangel','Sanhok','Miramar','Karakin')),
  prize_pool integer NOT NULL DEFAULT 0,
  entry_fee integer NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','completed')),
  slots_total integer NOT NULL DEFAULT 100,
  slots_filled integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tournaments" ON tournaments;
CREATE POLICY "anon_select_tournaments" ON tournaments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tournaments" ON tournaments;
CREATE POLICY "anon_insert_tournaments" ON tournaments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tournaments" ON tournaments;
CREATE POLICY "anon_update_tournaments" ON tournaments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tournaments" ON tournaments;
CREATE POLICY "anon_delete_tournaments" ON tournaments FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  leader_name text NOT NULL,
  pubg_id text NOT NULL,
  whatsapp text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('bKash','Nagad')),
  payment_number text NOT NULL,
  transaction_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
CREATE POLICY "anon_select_registrations" ON registrations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations" ON registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_registrations" ON registrations;
CREATE POLICY "anon_update_registrations" ON registrations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_registrations" ON registrations;
CREATE POLICY "anon_delete_registrations" ON registrations FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  team_name text NOT NULL,
  kills integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_select_leaderboard" ON leaderboard_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_insert_leaderboard" ON leaderboard_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_update_leaderboard" ON leaderboard_entries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_delete_leaderboard" ON leaderboard_entries FOR DELETE
  TO anon, authenticated USING (true);

-- Seed tournaments (start times relative to now so countdowns are live)
INSERT INTO tournaments (title, mode, map, prize_pool, entry_fee, starts_at, status, slots_total, slots_filled, image_url)
VALUES
  ('ZeroBullet Friday Clash', 'Squad', 'Erangel', 10000, 50, now() + interval '2 days 4 hours', 'upcoming', 100, 64, 'https://images.pexels.com/photos/7923816/pexels-photo-7923816.jpeg'),
  ('Sanhok Survival Showdown', 'Duo', 'Sanhok', 5000, 30, now() + interval '5 hours 30 minutes', 'upcoming', 60, 41, 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg'),
  ('Solo Sniper Masters', 'Solo', 'Erangel', 7000, 40, now() + interval '1 day 9 hours', 'upcoming', 80, 22, 'https://images.pexels.com/photos/1670974/pexels-photo-1670974.jpeg'),
  ('Karakin Quick Fire', 'Squad', 'Karakin', 4000, 20, now() + interval '3 hours 10 minutes', 'upcoming', 50, 38, 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg')
ON CONFLICT DO NOTHING;

-- Seed leaderboard entries for a completed tournament
INSERT INTO leaderboard_entries (tournament_id, rank, team_name, kills, total_points)
SELECT t.id, e.rank, e.team_name, e.kills, e.total_points
FROM tournaments t
CROSS JOIN (VALUES
  (1, 'Phoenix Esports', 42, 88),
  (2, 'Shadow Wolves', 38, 79),
  (3, 'Dragon Slayers', 35, 74),
  (4, 'Venom Squad', 31, 66),
  (5, 'Iron Fists', 28, 61),
  (6, 'Night Reapers', 25, 55),
  (7, 'Falcon Gaming', 22, 49),
  (8, 'Storm Riders', 19, 44),
  (9, 'Apex Predators', 17, 39),
  (10, 'Ghost Battalion', 14, 33)
) AS e(rank, team_name, kills, total_points)
WHERE t.title = 'ZeroBullet Friday Clash'
ON CONFLICT DO NOTHING;
