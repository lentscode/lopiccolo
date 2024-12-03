import pool from "@/config/db";
import {
	addItemToCart,
	createCart,
	editItemOfCart,
	removeItemFromCart,
} from "@/data/cart";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { clearDb } from "../utils";

describe("cart", () => {
	let userId: number;
	let productIds: number[];

	beforeEach(async () => {
		const res1 = await pool.query(
			`
      INSERT INTO users (email, hash_password)
      VALUES($1, $2)
      RETURNING id
      `,
			["email@google.com", "password"]
		);

		if (!res1 || res1.rowCount !== 1) {
			throw new Error("error");
		}

		userId = (
			res1.rows[0] as {
				id: number;
			}
		).id;

		const res2 = await pool.query(`
      INSERT INTO products 
      (name, description, price, availability)
      VALUES
      ('Nutella', 'Delicious chocolate Nutella', 799, 25),
      ('Gelato', 'Delicious gelato', 899, 30),
      ('Biscuits', 'Delicious biscuits', 599, 21)
      RETURNING id
      `);

		if (!res2) {
			throw new Error("products not initialized");
		}

		const rows: { id: string }[] = res2.rows;

		productIds = rows.map((e) => parseInt(e.id));
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

		test("should add item to cart", async () => {
			await addItemToCart(userId, productIds[0]);

			const res = await pool.query(
				"SELECT product_id FROM cart_items WHERE cart_id = $1",
				[cartId]
			);

			expect(res.rowCount).toBe(1);

			const data = res.rows[0] as {
				product_id: string;
			};

			expect(parseInt(data.product_id)).toBe(productIds[0]);
		});

		test("product does not exist, throws error", async () => {
			await expect(() => addItemToCart(userId, -1)).rejects.toThrow();
		});

		test("user does not exist, throws error", async () => {
			await expect(() =>
				addItemToCart(-1, productIds[0])
			).rejects.toThrow();
		});
	});

	describe("editItemOfCart", () => {
		let cartId: number;

		beforeEach(async () => {
			const { id } = await createCart(userId);

			cartId = id;

			await pool.query(
				`
				INSERT INTO cart_items
				(product_id, cart_id, quantity)
				VALUES ($1, $2, $3)
				`,
				[productIds[0], cartId, 1]
			);
		});

		test("should edit quantity of item", async () => {
			await editItemOfCart(userId, productIds[0], 2);

			const res = await pool.query(
				`
				SELECT quantity FROM cart_items
				WHERE cart_id = $1
				`,
				[cartId]
			);

			const { quantity }: { quantity: number } = res.rows[0];

			expect(quantity).toBe(2);
		});

		test("item in cart does not exist, should throw error", async () => {
			await expect(
				editItemOfCart(userId, productIds[1], 2)
			).rejects.toThrow();
		});

		test("user does not exist, should throw error", async () => {
			await expect(
				editItemOfCart(-1, productIds[0], 2)
			).rejects.toThrow();
		});
	});

	describe("removeItemFromCart", () => {
		let cartId: number;

		beforeEach(async () => {
			const { id } = await createCart(userId);

			cartId = id;

			await pool.query(
				`
				INSERT INTO cart_items
				(product_id, cart_id, quantity)
				VALUES ($1, $2, $3)
				`,
				[productIds[0], cartId, 1]
			);
		});

		test("should delete cart item", async () => {
			await removeItemFromCart(userId, productIds[0]);

			const res = await pool.query(
				`
				SELECT 1 FROM cart_items
				WHERE product_id = $1 AND
				cart_id = $2
				`,
				[productIds[0], cartId]
			);

			expect(res.rowCount).toBe(0)
		});

		test('item does not exist, should throw an error', async () => {
			await expect(
				removeItemFromCart(userId, -1)
			).rejects.toThrow()
		})

		test('user does not exist, should throw an error', async () => {
			await expect(
				removeItemFromCart(-1, productIds[0])
			).rejects.toThrow()
		})
	});
});
