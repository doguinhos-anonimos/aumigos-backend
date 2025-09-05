import { Type } from "@sinclair/typebox";
import type { AppInstance } from "@/app";
import { prisma } from "@/lib/prisma";
import {
	BadRequestError,
	BadRequestErrorSchema,
} from "../_errors/bad-request-error";

export async function RegisterUser(app: AppInstance) {
	app.post(
		"/user/register",
		{
			schema: {
				tags: ["User"],
				summary: "Create account for user",
				body: Type.Object({
					name: Type.String(),
					email: Type.String({ format: "email" }),
					password: Type.String({ minLength: 6 }),
					address: Type.Optional(Type.String()),
					phone: Type.Optional(Type.String()),
					latitude: Type.Optional(Type.Number()),
					longitude: Type.Optional(Type.Number()),
				}),
				response: {
					201: Type.Null(),
					400: BadRequestErrorSchema,
				},
			},
		},
		async (request, reply) => {
			const { name, email, password, address, latitude, longitude, phone } =
				request.body;

			const loginIsUsed = await prisma.login.findUnique({
				where: { email },
				select: { user: true, institution: true },
			});

			if (loginIsUsed) {
				throw new BadRequestError("Email already registered");
			}

			await prisma.$transaction(async (prisma) => {
				const login = await prisma.login.create({
					data: {
						email,
						passwordHash: password,
						loginType: "USER",
					},
				});

				await prisma.user.create({
					data: {
						name,
						address,
						latitude,
						longitude,
						phone,
						logins: { connect: { id: login.id } },
					},
				});
			});

			return reply.status(201).send();
		},
	);
}
