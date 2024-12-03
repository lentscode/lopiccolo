import pool from "@/config/db";
import { Cart } from "@/models/cart";

export async function createCart(userId: number) {
	const conn = await pool.connect();

	try {
		const res = await conn.query("SELECT * FROM create_cart($1)", [userId]);

		if (!res || res.rowCount !== 1) {
			throw new Error("cart not created");
		}

		const cartInfo: {
			id: string;
			created_at: Date;
			updated_at: Date;
		} = res.rows[0];

		return {
			id: parseInt(cartInfo.id),
			createdAt: cartInfo.created_at,
			updatedAt: cartInfo.updated_at,
		};
	} catch (error) {
		throw error;
	} finally {
		conn.release();
	}
}

export async function getCartOfUser(userId: number) {
	const conn = await pool.connect();

	try {
		const res = await conn.query("SELECT * FROM get_cart_of_user($1)", [
			userId,
		]);

		if (!res || res.rowCount !== 1) {
			conn.release();

			throw new Error("cart of user not retrieved");
		}

		const cart: Cart = res.rows[0];
		return cart;
	} catch (error) {
		throw error;
	} finally {
		conn.release();
	}
}

export async function addItemToCart(
	userId: number,
	productId: number,
	quantity: number = 1
) {
	const conn = await pool.connect();

	try {
		await conn.query("SELECT add_item_into_cart($1, $2, $3)", [
			userId,
			productId,
			quantity,
		]);
	} catch (error) {
		throw error;
	} finally {
		conn.release();
	}
}

export async function editItemOfCart(
	userId: number,
	productId: number,
	quantity: number
) {
	const conn = await pool.connect();

	try {
		await conn.query("SELECT edit_item_of_cart($1, $2, $3)", [
			userId,
			productId,
			quantity,
		]);
	} catch (error) {
		throw error;
	} finally {
		conn.release();
	}
}

export async function removeItemFromCart(userId: number, productId: number) {
	const conn = await pool.connect();

	try {
		await conn.query("SELECT remove_item_from_cart($1, $2)", [
			userId,
			productId,
		]);
	} catch (error) {
		throw error
	} finally {
		conn.release();
	}
}
