import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const projectIdSchema = z.string().uuid();

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function resolveProjectId(context: RouteContext) {
  const params = await Promise.resolve(context.params);
  return projectIdSchema.parse(params.id);
}

export async function GET(req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const projectId = await resolveProjectId(context);
    const url = new URL(req.url);
    const rawLimit = Number(url.searchParams.get("limit") ?? "20");
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 100) : 20;

    const supabase = createSupabaseAdminClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (projectError) {
      console.error("Failed to validate project for versions:", projectError);
      return NextResponse.json({ error: "Failed to load project versions" }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("project_versions")
      .select("id, reason, created_at")
      .eq("project_id", projectId)
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch project versions:", error);
      return NextResponse.json({ error: "Failed to load project versions" }, { status: 500 });
    }

    return NextResponse.json({ versions: data ?? [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    console.error("Unexpected project versions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
