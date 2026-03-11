import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  state: z.unknown().optional(),
});

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  const url = new URL(req.url);
  const rawLimit = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 100)
    : 50;

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, owner_id, name, state, created_at, updated_at")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch projects:", error);
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }

    return NextResponse.json({ projects: data ?? [] });
  } catch (error) {
    console.error("Unexpected project fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const rawBody: unknown = await req.json();
    const body = createProjectSchema.parse(rawBody);
    const statePayload = (body.state ?? {}) as Json;

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        owner_id: userId,
        name: body.name,
        state: statePayload,
      })
      .select("id, owner_id, name, state, created_at, updated_at")
      .single();

    if (error || !data) {
      console.error("Failed to create project:", error);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    const { error: versionError } = await supabase.from("project_versions").insert({
      project_id: data.id,
      owner_id: userId,
      snapshot: data.state,
      reason: "initial_create",
    });

    if (versionError) {
      console.error("Failed to write initial project version:", versionError);
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    console.error("Unexpected project creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
