import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as z from "zod";

const prisma = new PrismaClient();

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, password } = signupSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "A user with this email already exists." },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`.trim();

        const user = await prisma.user.create({
            data: {
                name: fullName,
                email,
                passwordHash,
            },
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        if (error?.name === "ZodError" || error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error during signup." },
            { status: 500 }
        );
    }
}
