CREATE OR REPLACE FUNCTION remove_item_from_cart (
  _user_id BIGINT,
  _product_id BIGINT
)
RETURNS VOID
AS $$
  DECLARE
    _cart_id BIGINT;

  BEGIN
    SELECT c.id INTO _cart_id
    FROM carts c
    WHERE c.user_id = _user_id
    ORDER BY c.created_at DESC
    LIMIT 1;

    IF _cart_id IS NULL THEN
      RAISE EXCEPTION 'User: % does not have a cart', _user_id;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM cart_items
      WHERE product_id = _product_id AND
      cart_id = _cart_id
    ) THEN
      RAISE EXCEPTION 'Item: % not present in cart of user: %', _product_id, _user_id;
    END IF;

    DELETE FROM cart_items
    WHERE product_id = _product_id AND
    cart_id = _cart_id;
  END
$$
LANGUAGE plpgsql;