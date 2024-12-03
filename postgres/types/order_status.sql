-- order_status TYPE
DO $$
	BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
	CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered');
	END IF;
END $$;