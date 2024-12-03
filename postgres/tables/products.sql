-- products TABLE
CREATE TABLE IF NOT EXISTS products (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	price INTEGER NOT NULL,
	availability INTEGER NOT NULL CHECK (availability >= 0),
	images_urls TEXT[],
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	stripe_id VARCHAR(255)
);

-- categories TABLE
CREATE TABLE IF NOT EXISTS categories (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT
);

-- product_categories TABLE
CREATE TABLE IF NOT EXISTS product_categories (
	product_id INTEGER REFERENCES products(id),
	category_id INTEGER REFERENCES categories(id)		
);