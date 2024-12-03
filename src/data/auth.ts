import pool from "@/config/db";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

let sessions: string[] = [];

export async function login(email: string, password: string) {
	const sql = await pool.connect();

	if (!email || !password) {
		return {
			emailError: "wrong",
			passwordError: "wrong",
		};
	}

	try {
		const res = await sql.query("SELECT * FROM login($1)", [email]);

		if (!res || res.rowCount !== 1) {
			return {
				emailError: "wrong",
				passwordError: "wrong",
			};
		}

		const data: {
			id: string;
			email: string;
			hash_password: string;
		} = res.rows[0];

		const passwordCorrect = await checkPassword(
			password,
			data.hash_password
		);

		if (!passwordCorrect) {
			return {
				emailError: "wrong",
				passwordError: "wrong",
			};
		}

		const sessionId = createSessionId();

		const user = {
			email: data.email,
			id: parseInt(data.id),
			sessionId,
		};

		return user;
	} catch (error) {
		throw error;
	} finally {
		sql.release();
	}
}

export async function signUp(
	email: string,
	password: string,
	confirmPassword: string
): Promise<
	| {
			emailError?: string;
			passwordError?: string;
			confirmPasswordError?: string;
	  }
	| { email: string; id: number }
> {
	const emailError = validateEmail(email);
	const passwordError = validatePassword(password);

	if (emailError || passwordError) {
		return {
			emailError,
			passwordError,
		};
	}

	if (password !== confirmPassword) {
		return {
			passwordError: "no match",
			confirmPasswordError: "no match",
		};
	}

	const hashedPassword = await hashPassword(password);

	const sql = await pool.connect();

	try {
		const res = await sql.query("SELECT * FROM signup($1, $2)", [
			email,
			hashedPassword,
		]);

		if (!res || res.rowCount !== 1) {
			return {
				emailError: "invalid",
				passwordError: "invalid",
			};
		}

		const data: {
			email: string;
			id: string;
		} = res.rows[0];

		const sessionId = createSessionId();

		const user = {
			email: data.email,
			id: parseInt(data.id),
			sessionId,
		};

		return user;
	} catch (error) {
		throw error;
	} finally {
		sql.release();
	}
}

export function checkSessionId(sessionId: string, sessions: string[]) {
	return sessions.includes(sessionId);
}

function createSessionId() {
	return randomUUID();
}

function addSessionId(sessionId: string, sessions: string[]) {
	const newSessions = [...sessions, sessionId];

	return newSessions;
}

function validateEmail(email: string) {
	if (email.length === 0 || !email.includes("@")) {
		return "invalid";
	}
}

function validatePassword(password: string) {
	if (
		password.length === 0 ||
		!password.match(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
		)
	) {
		return "invalid";
	}
}

async function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

async function checkPassword(password: string, hashPassword: string) {
	return bcrypt.compare(password, hashPassword);
}
