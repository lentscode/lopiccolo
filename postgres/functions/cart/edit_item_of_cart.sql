CREATE OR REPLACE FUNCTION edit_item_of_cart (
  _user_id BIGINT,
  _product_id BIGINT,
  _quantity INTEGER
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
      RAISE EXCEPTION 'No cart found for user: %', _user_id;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM cart_items 
      WHERE product_id = _product_id AND
      cart_id = _cart_id
    ) THEN
      RAISE EXCEPTION 'Item with id: % not in cart of user: %', _cart_id, _user_id;
    END IF;

    IF _quantity <= 0 THEN
      RAISE EXCEPTION 'Quantity must be a positive number';
    END IF;

    UPDATE cart_items
    SET quantity = _quantity
    WHERE product_id = _product_id AND
    cart_id = _cart_id;
  END
$$
LANGUAGE plpgsql;