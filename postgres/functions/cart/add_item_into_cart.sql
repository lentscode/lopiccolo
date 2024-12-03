CREATE OR REPLACE FUNCTION add_item_into_cart (
  _user_id BIGINT,
  _product_id BIGINT,
  _quantity INTEGER
)
RETURNS VOID
AS $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
      RAISE EXCEPTION 'User with id: % not found', _user_id;
    END IF; 

    INSERT INTO cart_items 
    (cart_id, product_id, quantity)
    SELECT c.id, _product_id, _quantity
    FROM carts c
    WHERE c.user_id = _user_id
    ORDER BY c.created_at DESC
    LIMIT 1;
  END
$$
LANGUAGE plpgsql;