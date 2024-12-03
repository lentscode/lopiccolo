import pool from "@/config/db";
import { createCart } from "@/data/cart";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { clearDb } from "../utils";

describe("cart", () => {
	let userId: number;

	beforeEach(async () => {
		const res = await pool.query(
			`
      INSERT INTO users (email, hash_password)
      VALUES($1, $2)
      RETURNING id
      `,
			["email@google.com", "password"]
		);

		if (!res || res.rowCount !== 1) {
			throw new Error("error");
		}

		userId = (
			res.rows[0] as {
				id: number;
			}
		).id;
	});

	afterEach(async () => {
		await clearDb(pool);
	});

	describe("createCart", () => {
		test("should create cart for user", async () => {
			const cartInfo = await createCart(userId);

			expect(cartInfo).toHaveProperty("id");
			expect(cartInfo).toHaveProperty("createdAt");
			expect(cartInfo).toHaveProperty("updatedAt");

			const res = await pool.query(
				"SELECT id FROM carts WHERE user_id = $1",
				[userId]
			);

			expect(res.rowCount).toBe(1);
			expect(res.rows[0]).toHaveProperty("id");
		});

		test("user does not exist, should throw an error", async () => {
			await expect(() => createCart(-1)).rejects.toThrow();
		});
	});

	describe("addItemToCart", () => {
		let cartId: number;

		beforeEach(async () => {
			const { id } = await createCart(userId);

			cartId = id;
		});

		//TODO: CONTINUE
		test("should add item to cart", async () => {});
	});
});
