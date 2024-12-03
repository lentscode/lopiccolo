import pg from "pg";

const { Pool } = pg;

//TODO: IMPLEMENT
const pool = new Pool({
	database: process.env.POSTGRES_DB,
	host: process.env.POSTGRES_HOST,
	password: process.env.POSTGRES_PASSWORD,
	user: process.env.POSTGRES_USER,
});

export default pool;
