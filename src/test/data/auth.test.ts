import postgres from "postgres";
import { signUp } from "../../data/auth";
import { expect, test, describe } from 'vitest'

describe("auth", () => {
	test("sign up returns email and id", async () => {
		const sql = postgres({
			db: process.env.POSTGRES_DB,
			host: process.env.POSTGRES_HOST,
			password: process.env.POSTGRES_PASSWORD,
			user: process.env.POSTGRES_USER
		});

		const result = await signUp(
			sql,
			"email@example.com",
			"password1!",
			"password1!"
		);

		expect(result).toHaveProperty("email");
		expect(result).toBe({
			email: "email@example.com",
			id: 1,
		});
	});
});
