import { signUp } from "@/data/auth";

export default async function POST(req: Request) {
	const {
		email,
		password,
		confirmPassword,
	}: { email?: string; password?: string; confirmPassword?: string } =
		await req.json();

	if (!email || !password || !confirmPassword) {
		return Response.json("Missing fields", { status: 400 });
	}

	const result = await signUp(email, password, confirmPassword);

	if ("email" in result) {
		return Response.json(result, { status: 200 });
	}

	return Response.json(result, { status: 422 });
}
