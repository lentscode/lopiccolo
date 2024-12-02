import { Sql } from "postgres";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { signUp } from "../../data/auth";
import { clearDb, createTestDb } from "../utils";

describe("auth", () => {
	let sql: Sql;

	beforeAll(() => {
		sql = createTestDb();
	});

	afterAll(async () => {
		await clearDb(sql);
	});

	describe("signup", () => {
		test("sign up returns email and id", async () => {
			const result = await signUp(
				sql,
				"email@example.com",
				"password1!",
				"password1!"
			);

			expect(result).toHaveProperty("email");
			expect(result).toHaveProperty("id");

			expect(result).not.toHaveProperty("emailError");
			expect(result).not.toHaveProperty("passwordError");
			expect(result).not.toHaveProperty("confirmPasswordError");

			const data = result as {
				email: string;
				id: number;
			};

			const [user]: [
				{
					email: string;
					hash_password: string;
				}?
			] = await sql`
			SELECT email, hash_password FROM users
			WHERE id = ${data.id}
			`;

			expect(user).not.toBeNull();

			expect(user).toHaveProperty("email");
			expect(user).toHaveProperty("hash_password");

			expect(user?.email).toBe("email@example.com");
			expect(user?.hash_password).not.toBe("password1!");
		});

		test("email not formatted correctly", async () => {
			const result = await signUp(
				sql,
				"email.example.com",
				"password1!",
				"password1!"
			);

			expect(result).toHaveProperty("emailError");

			const { emailError } = result as {
				emailError: string;
			};

			expect(emailError).toBe("invalid");
		});

		test("password does not have requirements", async () => {
			const result = await signUp(
				sql,
				"email@example.com",
				"password",
				"password"
			);

			expect(result).toHaveProperty("passwordError")

			const {passwordError} = result as {
				passwordError: string
			}

			expect(passwordError).toBe("invalid")
		});

		test("password and confirm password not equal", async () => {
			const result = await signUp(
				sql,
				"email@example.com",
				"password1!",
				"password2!"
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
	});
});
