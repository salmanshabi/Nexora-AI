import { NextResponse } from "next/server";
import * as z from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, password } = signupSchema.parse(body);

        const fullName = `${firstName} ${lastName}`.trim();
        const supabase = createSupabaseAdminClient();

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName },
        });

        if (error) {
            if (
                error.message.toLowerCase().includes("already registered") ||
                error.message.toLowerCase().includes("already exists") ||
                error.code === "email_exists"
            ) {
                return NextResponse.json(
                    { error: "A user with this email already exists." },
                    { status: 400 }
                );
            }
            console.error("Supabase Auth signup error:", error);
            return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
        }

        if (!data.user) {
            return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
        }

        // Create profile row (non-fatal if it fails)
        const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email,
            full_name: fullName,
        });
        if (profileError) {
            console.error("Failed to create profile row:", profileError);
        }

        return NextResponse.json(
            { message: "Account created successfully", userId: data.user.id },
            { status: 201 }
        );
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
        }
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error during signup." },
            { status: 500 }
        );
    }
}
