-- orders TABLE
CREATE TABLE IF NOT EXISTS orders (
	id BIGSERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id),
	order_date TIMESTAMP NOT NULL DEFAULT NOW(),
	status order_status NOT NULL DEFAULT 'pending',
	total INTEGER NOT NULL DEFAULT 0,
	cart_id INTEGER NOT NULL REFERENCES carts(id)
);

-- order_items TABLE
CREATE TABLE IF NOT EXISTS order_items (
	order_id INTEGER NOT NULL REFERENCES orders(id),
	product_id INTEGER NOT NULL REFERENCES products(id),
	quantity INTEGER NOT NULL,
	price INTEGER NOT NULL,
	stripe_id VARCHAR(255)
);