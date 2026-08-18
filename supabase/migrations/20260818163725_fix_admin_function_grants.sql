/*
# Fix function EXECUTE grants

The default PostgreSQL grant gives EXECUTE to PUBLIC, which includes anon.
REVOKE FROM anon alone does not remove that path. This migration revokes
from PUBLIC first, then grants to authenticated only.

1. Functions affected:
- is_admin()
- claim_admin()
- admin_approve_registration(p_id uuid)
- admin_reject_registration(p_id uuid)
2. Security: anon can no longer call any of these. authenticated can.
*/

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION claim_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION admin_approve_registration(p_id uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_approve_registration(p_id uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION admin_reject_registration(p_id uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_reject_registration(p_id uuid) TO authenticated;
