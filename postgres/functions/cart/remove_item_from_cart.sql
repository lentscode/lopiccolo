CREATE OR REPLACE FUNCTION remove_item_from_cart (
  _user_id BIGINT,
  _product_id BIGINT
)
AS $$
  BEGIN
    DELETE FROM cart_items
    WHERE product_id = _product_id AND
    cart_id = (
      SELECT c.id FROM carts c
      WHERE c.user_id = _user_id
      ORDER BY c.created_at DESC
      LIMIT 1;
    )
  END
LANGUAGE plpgsql;