import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

const projectIdSchema = z.string().uuid();
const versionIdSchema = z.string().uuid();

type RouteContext = {
  params:
    | Promise<{ id: string; versionId: string }>
    | { id: string; versionId: string };
};

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function resolveParams(context: RouteContext) {
  const params = await Promise.resolve(context.params);
  return {
    projectId: projectIdSchema.parse(params.id),
    versionId: versionIdSchema.parse(params.versionId),
  };
}

export async function POST(_req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const { projectId, versionId } = await resolveParams(context);
    const supabase = createSupabaseAdminClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (projectError) {
      console.error("Failed to validate project for restore:", projectError);
      return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: version, error: versionError } = await supabase
      .from("project_versions")
      .select("id, snapshot")
      .eq("id", versionId)
      .eq("project_id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (versionError) {
      console.error("Failed to load version for restore:", versionError);
      return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
    }

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const restoredState = version.snapshot as Json;

    const { data: updatedProject, error: updateError } = await supabase
      .from("projects")
      .update({ state: restoredState })
      .eq("id", projectId)
      .eq("owner_id", userId)
      .select("id, owner_id, name, state, created_at, updated_at")
      .maybeSingle();

    if (updateError || !updatedProject) {
      console.error("Failed to update project during restore:", updateError);
      return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
    }

    const { error: snapshotError } = await supabase.from("project_versions").insert({
      project_id: projectId,
      owner_id: userId,
      snapshot: updatedProject.state,
      reason: `restore:${versionId}`,
    });

    if (snapshotError) {
      console.error("Failed to log restore snapshot:", snapshotError);
    }

    return NextResponse.json({ project: updatedProject, restoredVersionId: versionId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid project or version ID" }, { status: 400 });
    }

    console.error("Unexpected restore version error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
