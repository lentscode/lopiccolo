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
    RETURN QUERY
    SELECT u.id, u.email, u.hash_password
    FROM users AS u
    WHERE u.email = _email;
  END
$$
LANGUAGE plpgsql;