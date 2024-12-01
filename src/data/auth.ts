import sql, { Id } from "@/config/db";
import bcrypt from "bcrypt";

export async function login(email: string, password: string) {
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
			hashPassword: string;
		}?
	] = await sql`
    SELECT login(${email})
  `;

	if (!res) {
		return {
			emailError: "wrong",
			passwordError: "wrong",
		};
	}

	const passwordCorrect = await checkPassword(password, res.hashPassword);

	if (!passwordCorrect) {
		return {
			emailError: "wrong",
			passwordError: "wrong",
		};
	}

	const user = {
		email,
		id: res.id,
	};

	return user;
}

export async function signUp(
	email: string,
	password: string,
	confirmPassword: string
) {
	const emailError = validateEmail(email);
	const passwordError = validatePassword(password);

	if (emailError || passwordError) {
		return {
			emailError,
			passwordError,
			confirmPassword: null,
		};
	}

	if (password !== confirmPassword) {
		return {
			emailError: null,
			passwordError: "no match",
			confirmPasswordError: "no match",
		};
	}

	const hashedPassword = await hashPassword(password);

	const [res]: [Id?] = await sql`
    SELECT signup(${email}, ${hashedPassword})
  `;

	if (!res) {
		return {
			emailError: "invalid",
			passwordError: "invalid",
			confirmPasswordError: null,
		};
	}

	const user = {
		email,
		id: res.id,
	};

	return user;
}

function validateEmail(email: string) {
	if (email.length === 0 || email.includes("@")) {
		return "invalid";
	}
	return null;
}

function validatePassword(password: string) {
	if (
		password.length === 0 ||
		password.match(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
		)
	) {
		return "invalid";
	}
	return null;
}

async function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

async function checkPassword(password: string, hashPassword: string) {
	return bcrypt.compare(password, hashPassword);
}
