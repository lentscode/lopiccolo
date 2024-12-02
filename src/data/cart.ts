import db from "@/config/db";
import { Cart } from "@/models/cart";
import { Pool } from "pg";

export async function getCartOfUser(userId: number, pool: Pool = db) {
	const conn = await pool.connect();

	const res = await conn.query("SELECT * FROM get_cart_of_user($1)", [
		userId,
	]);

	if (!res || res.rowCount !== 1) {
		conn.release();

		throw new Error("cart of user not retrieved");
	}

	const cart: Cart = res.rows[0];

	return cart;
}
