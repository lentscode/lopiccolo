CREATE OR REPLACE FUNCTION signup (
  _email VARCHAR(255),
  _hash_password VARCHAR(255)
)
RETURNS TABLE (
  email VARCHAR(255),
  id BIGINT
)
AS $$
  BEGIN
    RETURN QUERY
    INSERT INTO users AS u
    (email, hash_password)
    VALUES (_email, _hash_password)
    RETURNING u.email, u.id;

    -- HANDLE EXCEPTIONS 
  END
$$
LANGUAGE plpgsql;