import pool from "@/config/db";
import { getProductById, getProducts } from "@/data/products";
import { afterEach, beforeEach } from "node:test";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { clearDb } from "../utils";

describe("products", () => {
	let ids: number[];

	beforeAll(async () => {
		const res = await pool.query(`
      INSERT INTO products 
      (name, description, price, availability)
      VALUES
      ('Nutella', 'Delicious chocolate Nutella', 799, 25),
      ('Gelato', 'Delicious gelato', 899, 30),
      ('Biscuits', 'Delicious biscuits', 599, 21)
      RETURNING id
      `);

		if (!res) {
			throw new Error("products not initialized");
		}

		const rows: { id: string }[] = res.rows;

		ids = rows.map((e) => parseInt(e.id));
	});

	afterAll(async () => {
		await clearDb(pool);
	});

	describe("getProducts", () => {
		test("should return a list of products", async () => {
			const products = await getProducts();

			for (const product of products) {
				expect(ids.includes(product.id))
			}
		});
	});

	describe("getProductById", () => {
		test("should return a product", async () => {
			const product = await getProductById(ids[0]);

			expect(product).not.toBeNull();
			expect(product.name).toBe("Nutella");
		});

		test('product does not exist, throws error', async () => {
			await expect(
				() => getProductById(-1)
			).rejects.toThrow()
		})
	});
});
