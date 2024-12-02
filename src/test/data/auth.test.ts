import { Pool } from "pg";
import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { login, signUp } from "../../data/auth";
import { clearDb, createTestDb } from "../utils";

describe("auth", () => {
	let pool: Pool;
	const email = "email@example.com";
	const password = "password1!";

	beforeAll(() => {
		pool = createTestDb();
	});

	afterEach(async () => {
		await clearDb(pool);
	});

	describe("signup", () => {
		test("sign up returns email and id", async () => {
			const result = await signUp(email, password, password, pool);

			expect(result).toHaveProperty("email");
			expect(result).toHaveProperty("sessionId");
			expect(result).toHaveProperty("id");

			expect(result).not.toHaveProperty("emailError");
			expect(result).not.toHaveProperty("passwordError");
			expect(result).not.toHaveProperty("confirmPasswordError");

			const data = result as {
				email: string;
				sessionId: string;
				id: number;
			};

			const res = await pool.query(
				`
				SELECT email, hash_password FROM users
				WHERE id = $1
				`,
				[data.id]
			);

			expect(res.rowCount).toBe(1)

			const user: {
				email: string,
				hash_password: string
			} = res.rows[0]

			expect(user).not.toBeNull();

			expect(user).toHaveProperty("email");
			expect(user).toHaveProperty("hash_password");

			expect(user?.email).toBe(email);
			expect(user?.hash_password).not.toBe(password);
		});

		test("email not formatted correctly", async () => {
			const result = await signUp(
				"email.example.com",
				password,
				password,
				pool
			);

			expect(result).toHaveProperty("emailError");

			const { emailError } = result as {
				emailError: string;
			};

			expect(emailError).toBe("invalid");
		});

		test("password does not have requirements", async () => {
			const result = await signUp(email, "password", "password", pool);

			expect(result).toHaveProperty("passwordError");

			const { passwordError } = result as {
				passwordError: string;
			};

			expect(passwordError).toBe("invalid");
		});

		test("password and confirm password not equal", async () => {
			const result = await signUp(
				email,
				"password1!",
				"password2!",
				pool
			);

			expect(result).toHaveProperty("passwordError");
			expect(result).toHaveProperty("confirmPasswordError");

			const { passwordError, confirmPasswordError } = result as {
				passwordError: string;
				confirmPasswordError: string;
			};

			expect(passwordError).toBe("no match");
			expect(confirmPasswordError).toBe("no match");
		});

		test("sign up fails because email is taken", async () => {
			await signUp(email, password, password, pool);

			await expect(() =>
				signUp(email, password, password, pool)
			).rejects.toThrow();
		});
	});

	describe("login", () => {
		test("should return email and id of user", async () => {
			await signUp(email, password, password, pool);

			const result = await login(email, password, pool);

			expect(result).toHaveProperty("email");
			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("sessionId");

			const data = result as {
				email: string;
				id: number;
				sessionId: string;
			};

			expect(data.email).toBe("email@example.com");
		});

		test("user not found, should return an error object", async () => {
			await signUp(email, password, password, pool);

			const result = await login("email@example.it", password, pool);

			expect(result).toHaveProperty("emailError");
			expect(result).toHaveProperty("passwordError");

			const data = result as {
				emailError: string;
				passwordError: string;
			};

			expect(data.emailError).toBe("wrong");
			expect(data.passwordError).toBe("wrong");
		});

		test("wrong password, should return an error object", async () => {
			await signUp(email, password, password, pool);

			const result = await login(email, "password", pool);

			expect(result).toHaveProperty("emailError");
			expect(result).toHaveProperty("passwordError");

			const data = result as {
				emailError: string;
				passwordError: string;
			};

			expect(data.emailError).toBe("wrong");
			expect(data.passwordError).toBe("wrong");
		});
	});
});
