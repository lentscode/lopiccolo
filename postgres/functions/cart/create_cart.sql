CREATE OR REPLACE FUNCTION create_cart(
  _user_id BIGINT
)
RETURNS TABLE (
  id BIGINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
AS $$
  BEGIN
    RETURN QUERY
    INSERT INTO carts c
    (c.user_id)
    VALUES (_user_id)
    RETURNING c.id, c.created_at, c.updated_at
  END
$$
LANGUAGE plpgsql;