CREATE OR REPLACE FUNCTION get_cart_of_user(
  _user_id BIGINT
)
RETURNS JSON
AS $$
  DECLARE
  cart JSON;

  BEGIN
    SELECT JSON_BUILD_OBJECT(
      'id', c.id,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'items', (
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ci.id,
            'name', ci.name,
            'description', ci.description,
            'price', ci.price,
            'availability', ci.availability,
            'imagesUrls', ci.images_urls,
            'quantity', ci.quantity
          )
        )
        FROM cart_items ci
        WHERE ci.cart_id = c.id
      ),
      'total', c.total
    ) INTO cart
    FROM carts c
    WHERE c.user_id = _user_id
    ORDER BY c.updated_at DESC
    LIMIT 1;

    IF cart IS NULL THEN
      RAISE EXCEPTION 'Cart for user with id: % not found', _user_id;
    ENDIF;

    RETURN cart;
  END
$$
LANGUAGE plpgsql;