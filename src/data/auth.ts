import db from "@/config/db";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Sql } from "postgres";

let sessions: string[] = [];

export async function login(email: string, password: string, sql: Sql = db) {
	if (!email || !password) {
		return {
			emailError: "wrong",
			passwordError: "wrong",
		};
	}

	const [res]: [
		{
			id: number;
			email: string;
			hash_password: string;
		}?
	] = await sql`
    SELECT * FROM login(${email})
  `;

	if (!res) {
		return {
			emailError: "wrong",
			passwordError: "wrong",
		};
	}

	const passwordCorrect = await checkPassword(password, res.hash_password);

	if (!passwordCorrect) {
		return {
			emailError: "wrong",
			passwordError: "wrong",
		};
	}

	const sessionId = createSessionId();

	const user = {
		email: res.email,
		id: res.id,
		sessionId,
	};

	return user;
}

export async function signUp(
	email: string,
	password: string,
	confirmPassword: string,
	sql: Sql = db
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

	const [res]: [
		{
			email: string;
			id: string;
		}?
	] = await sql`
    SELECT * FROM signup(${email}, ${hashedPassword})
  `;

	if (!res) {
		return {
			emailError: "invalid",
			passwordError: "invalid",
		};
	}

	const sessionId = createSessionId();

	const user = {
		email: res.email,
		id: parseInt(res.id),
		sessionId,
	};

	return user;
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
