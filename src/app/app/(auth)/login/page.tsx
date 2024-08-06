import { getAuthSession } from "~/server/auth";
import { LoginForm } from "./components/login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const session = await getAuthSession();

	if (session) {
		redirect("/");
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<LoginForm />
		</div>
	);
}
