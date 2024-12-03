CREATE OR REPLACE FUNCTION add_item_into_cart (
  _user_id BIGINT,
  _product_id BIGINT,
  _quantity INTEGER
)
AS $$
  BEGIN
    INSERT INTO cart_items 
    (cart_id, product_id, quantity)
    SELECT c.id, _product_id, _quantity
    FROM carts c
    WHERE c.user_id = _user_id
    ORDER BY c.created_at DESC
    LIMIT 1;
  END
LANGUAGE plpgsql;