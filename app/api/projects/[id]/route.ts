import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

const projectIdSchema = z.string().uuid();

const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    state: z.unknown().optional(),
    reason: z.string().trim().max(120).optional(),
  })
  .refine((value) => value.name !== undefined || value.state !== undefined, {
    message: "At least one of name or state is required",
  });

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

export async function GET(_req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const projectId = await resolveProjectId(context);
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("projects")
      .select("id, owner_id, name, state, created_at, updated_at")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch project:", error);
      return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    console.error("Unexpected project fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const projectId = await resolveProjectId(context);
    const rawBody: unknown = await req.json();
    const body = updateProjectSchema.parse(rawBody);

    const updates: { name?: string; state?: Json } = {};
    if (body.name !== undefined) {
      updates.name = body.name;
    }
    if (body.state !== undefined) {
      updates.state = body.state as Json;
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updates as any)
      .eq("id", projectId)
      .eq("owner_id", userId)
      .select("id, owner_id, name, state, created_at, updated_at")
      .maybeSingle();

    if (error) {
      console.error("Failed to update project:", error);
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (body.state !== undefined) {
      const { error: versionError } = await supabase.from("project_versions").insert({
        project_id: projectId,
        owner_id: userId,
        snapshot: data.state,
        reason: body.reason ?? "manual_update",
      });

      if (versionError) {
        console.error("Failed to write project version snapshot:", versionError);
      }
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    console.error("Unexpected project update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const projectId = await resolveProjectId(context);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("owner_id", userId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Failed to delete project:", error);
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    console.error("Unexpected project delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
