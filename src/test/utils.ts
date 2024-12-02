import postgres, { Sql } from "postgres";

export function createTestDb() {
	const sql = postgres({
		db: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
		password: process.env.POSTGRES_PASSWORD,
		user: process.env.POSTGRES_USER,
	});

	return sql;
}

export async function clearDb(db: Sql) {
	await db`
    DO $$ DECLARE
      table_name text;
    BEGIN
      FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || table_name || ' CASCADE;';
      END LOOP;
    END $$;
  `;
}
