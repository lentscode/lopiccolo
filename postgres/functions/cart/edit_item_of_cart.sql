CREATE OR REPLACE FUNCTION edit_item_of_cart (
  _user_id BIGINT,
  _product_id BIGINT,
  _quantity INTEGER
)
AS $$
  BEGIN
    UPDATE cart_items
    SET quantity = _quantity
    WHERE product_id = _product_id AND
    cart_id = (
      SELECT c.id FROM carts c
      WHERE c.user_id = _user_id
      ORDER BY c.created_at DESC
      LIMIT 1;
    )
  END
LANGUAGE plpgsql;