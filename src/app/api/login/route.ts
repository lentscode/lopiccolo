import { login } from "@/data/auth";

export default async function POST(req: Request) {
	const { email, password }: { email?: string; password?: string } =
		await req.json();

	if (!email || !password) {
		return Response.json("Missing fields", { status: 400 });
	}

	const result = await login(email, password);

	if ("email" in result) {
		return Response.json(result, {
			status: 200,
		});
	}
	return Response.json(result, { status: 422 });
}
