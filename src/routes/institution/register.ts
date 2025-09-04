import { Type } from "@sinclair/typebox";
import type { AppInstance } from "@/app";
import { prisma } from "@/lib/prisma";
import { BadRequestErrorSchema } from "../_errors/bad-request-error";
import { ConflictError, ConflictErrorSchema } from "../_errors/conflict-error";

export async function RegisterInstitution(app: AppInstance) {
	app.post(
		"/institution/register",
		{
			schema: {
				tags: ["Institution"],
				summary: "Create account for institution",
				body: Type.Object({
					name: Type.String(),
					email: Type.String({ format: "email" }),
					password: Type.String({ minLength: 6 }),
					address: Type.String(),
					phone: Type.Optional(Type.String()),
					cnpj: Type.String(),
					latitude: Type.Number(),
					longitude: Type.Number(),
				}),
				response: {
					201: Type.Null(),
					409: ConflictErrorSchema,
					400: BadRequestErrorSchema,
				},
			},
		},
		async (request, reply) => {
			const data = request.body;

			const institutionOnly = await prisma.login.findUnique({
				where: { email: data.email },
				select: { institution: true },
			});

			if (institutionOnly) {
				throw new ConflictError("Email or CNPJ already registered");
			}

			await prisma.$transaction(async (prisma) => {
				const login = await prisma.login.create({
					data: {
						email: data.email,
						passwordHash: data.password,
						loginType: "INSTITUTION",
					},
				});

				await prisma.institution.create({
					data: {
						address: data.address,
						cnpj: data.cnpj,
						name: data.name,
						phone: data.phone,
						latitude: data.latitude,
						longitude: data.longitude,
						logins: { connect: { id: login.id } },
					},
				});
			});

			return reply.status(201).send();
		},
	);
}
