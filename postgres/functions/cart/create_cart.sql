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
    INSERT INTO carts
    (user_id)
    VALUES (_user_id)
    RETURNING carts.id, carts.created_at, carts.updated_at;
  END
$$
LANGUAGE plpgsql;