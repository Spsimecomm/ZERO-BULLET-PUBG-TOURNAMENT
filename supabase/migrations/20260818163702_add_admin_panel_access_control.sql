/*
# Admin Panel — server-enforced access control

1. New Tables
- `admins` — maps auth.users to admin privileges (user_id PK, references auth.users).

2. New Functions (SECURITY DEFINER, search_path = public)
- `is_admin()` — returns true if the caller (auth.uid()) is in the admins table.
- `claim_admin()` — bootstrap: if NO admin exists yet, adds the caller as admin. Fails once an admin exists.
- `admin_approve_registration(p_id)` — sets a registration to 'confirmed' and atomically increments the tournament's slots_filled (only if not already confirmed).
- `admin_reject_registration(p_id)` — sets a registration to 'rejected' and decrements slots_filled if it was previously confirmed.

3. Security Changes
- registrations SELECT: restricted to authenticated admins only (contains payment numbers + transaction IDs — sensitive data).
- registrations INSERT: stays public (anon + authenticated) but WITH CHECK enforces status = 'pending' so a client cannot self-approve.
- registrations UPDATE / DELETE: admin-only (authenticated + is_admin()).
- tournaments INSERT / UPDATE / DELETE: admin-only. SELECT stays public.
- leaderboard_entries INSERT / UPDATE / DELETE: admin-only. SELECT stays public.
- admins table: RLS enabled, users can only SELECT their own row.
- EXECUTE on all admin functions revoked from anon, granted to authenticated.

4. Important Notes
- The approve/reject functions are SECURITY DEFINER so they bypass RLS to update both registrations and tournaments atomically.
- is_admin() derives the caller from auth.uid() — never from a parameter.
- claim_admin() only works when the admins table is empty, preventing privilege escalation.
*/

-- ── Admins table ──
CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_own_row" ON admins;
CREATE POLICY "admin_select_own_row" ON admins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- ── is_admin() helper ──
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ── claim_admin() bootstrap ──
CREATE OR REPLACE FUNCTION claim_admin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  admin_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT count(*) INTO admin_count FROM admins;
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'An admin already exists';
  END IF;

  INSERT INTO admins (user_id) VALUES (auth.uid());
  RETURN 'Admin claimed successfully';
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_admin() FROM anon;
GRANT EXECUTE ON FUNCTION claim_admin() TO authenticated;

-- ── admin_approve_registration() ──
CREATE OR REPLACE FUNCTION admin_approve_registration(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_current_status text;
  v_tournament_id uuid;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT status, tournament_id INTO v_current_status, v_tournament_id
  FROM registrations WHERE id = p_id;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Registration not found';
  END IF;

  IF v_current_status = 'confirmed' THEN
    RETURN;
  END IF;

  UPDATE registrations SET status = 'confirmed' WHERE id = p_id;

  UPDATE tournaments
  SET slots_filled = LEAST(slots_filled + 1, slots_total)
  WHERE id = v_tournament_id AND slots_filled < slots_total;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_approve_registration(p_id uuid) FROM anon;
GRANT EXECUTE ON FUNCTION admin_approve_registration(p_id uuid) TO authenticated;

-- ── admin_reject_registration() ──
CREATE OR REPLACE FUNCTION admin_reject_registration(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_current_status text;
  v_tournament_id uuid;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT status, tournament_id INTO v_current_status, v_tournament_id
  FROM registrations WHERE id = p_id;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Registration not found';
  END IF;

  IF v_current_status = 'confirmed' THEN
    UPDATE tournaments
    SET slots_filled = GREATEST(slots_filled - 1, 0)
    WHERE id = v_tournament_id;
  END IF;

  UPDATE registrations SET status = 'rejected' WHERE id = p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_reject_registration(p_id uuid) FROM anon;
GRANT EXECUTE ON FUNCTION admin_reject_registration(p_id uuid) TO authenticated;

-- ── Tighten registrations policies ──
DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_update_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_delete_registrations" ON registrations;

-- SELECT: admin only (sensitive payment data)
CREATE POLICY "admin_select_registrations" ON registrations FOR SELECT
  TO authenticated USING (is_admin());

-- INSERT: public, but must be pending (prevents self-approval)
CREATE POLICY "public_insert_registrations" ON registrations FOR INSERT
  TO anon, authenticated WITH CHECK (status = 'pending');

-- UPDATE: admin only
CREATE POLICY "admin_update_registrations" ON registrations FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- DELETE: admin only
CREATE POLICY "admin_delete_registrations" ON registrations FOR DELETE
  TO authenticated USING (is_admin());

-- ── Tighten tournaments policies ──
DROP POLICY IF EXISTS "anon_insert_tournaments" ON tournaments;
DROP POLICY IF EXISTS "anon_update_tournaments" ON tournaments;
DROP POLICY IF EXISTS "anon_delete_tournaments" ON tournaments;

-- SELECT stays public
CREATE POLICY "admin_insert_tournaments" ON tournaments FOR INSERT
  TO authenticated WITH CHECK (is_admin());

CREATE POLICY "admin_update_tournaments" ON tournaments FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_delete_tournaments" ON tournaments FOR DELETE
  TO authenticated USING (is_admin());

-- ── Tighten leaderboard_entries policies ──
DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard_entries;
DROP POLICY IF EXISTS "anon_update_leaderboard" ON leaderboard_entries;
DROP POLICY IF EXISTS "anon_delete_leaderboard" ON leaderboard_entries;

CREATE POLICY "admin_insert_leaderboard" ON leaderboard_entries FOR INSERT
  TO authenticated WITH CHECK (is_admin());

CREATE POLICY "admin_update_leaderboard" ON leaderboard_entries FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_delete_leaderboard" ON leaderboard_entries FOR DELETE
  TO authenticated USING (is_admin());
