CREATE OR REPLACE FUNCTION signup (
  _email VARCHAR(255),
  _hash_password VARCHAR(255)
)
RETURNS BIGINT
AS $$
  BEGIN
    SELECT id FROM users
    WHERE email = _email AND
    hash_password = _hash_password;
  END
LANGUAGE plpgsql;