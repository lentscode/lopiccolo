CREATE OR REPLACE FUNCTION login (
  _email VARCHAR(255)
)
RETURNS TABLE (
  id BIGINT,
  email VARCHAR(255),
  hash_password VARCHAR(255)
)
AS $$
  BEGIN
    SELECT id, email, hash_password
    FROM users
    WHERE email = _email;
  END
$$
LANGUAGE plpgsql;