CREATE OR REPLACE FUNCTION get_product_by_id (
  _product_id BIGINT
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  description TEXT,
  price INTEGER,
  availability INTEGER,
  images_urls TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  category_name VARCHAR(255),
  category_description TEXT
)
AS $$
  BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.description,
    p.price, p.availability, p.images_urls,
    p.created_at, p.updated_at, c.name, c.description
    FROM products AS p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.id = _product_id;
  END
$$
LANGUAGE plpgsql;