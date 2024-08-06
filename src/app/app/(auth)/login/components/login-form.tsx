"use client";

import { signIn } from "next-auth/react";

import { Button } from "~/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/card";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from "~/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/input";

const FormSchema = z.object({
	email: z.string().email(),
});

type TFormSchema = z.infer<typeof FormSchema>;

export function LoginForm() {
	const form = useForm<TFormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(async (data) => {
					await signIn("email", { email: data.email });
				})}
			>
				<Card className="mx-auto max-w-sm">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>
							Enter your email below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Login
							</Button>
							<Button
								onPress={() => {
									signIn("passkey");
								}}
								type="button"
								variant="outline"
								className="w-full"
							>
								Login with Passkey
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}
