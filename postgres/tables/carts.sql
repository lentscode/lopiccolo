-- carts TABLE
CREATE TABLE IF NOT EXISTS carts (
	id BIGSERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    total INTEGER NOT NULL DEFAULT 0
);

-- cart_items TABLE
CREATE TABLE IF NOT EXISTS cart_items (
	cart_id INTEGER NOT NULL REFERENCES carts(id),
	product_id INTEGER NOT NULL REFERENCES products(id),
	quantity INTEGER NOT NULL DEFAULT 1
);