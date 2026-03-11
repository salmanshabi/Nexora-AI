import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

const projectIdSchema = z.string().uuid();

const publishSchema = z.object({
  slug: z.string().trim().min(3).max(80).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function slugify(input: string) {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) return "site";
  if (normalized.length < 3) return `${normalized}-site`.slice(0, 80);
  return normalized.slice(0, 80);
}

async function resolveProjectId(context: RouteContext) {
  const params = await Promise.resolve(context.params);
  return projectIdSchema.parse(params.id);
}

async function buildUniqueSlug(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  baseSlug: string,
  projectId: string
) {
  let attempt = 0;
  while (attempt < 100) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`.slice(0, 80);
    const { data, error } = await supabase
      .from("published_sites")
      .select("project_id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.project_id === projectId) {
      return candidate;
    }

    attempt += 1;
  }

  throw new Error("Unable to allocate a unique slug");
}

function buildPublicUrl(req: Request, slug: string) {
  const url = new URL(req.url);
  return `${url.origin}/sites/${slug}`;
}

export async function GET(req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorizedResponse();

  try {
    const projectId = await resolveProjectId(context);
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("published_sites")
      .select("id, project_id, slug, is_active, published_at, updated_at")
      .eq("project_id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch publish status:", error);
      return NextResponse.json({ error: "Failed to fetch publish status" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ published: false });
    }

    return NextResponse.json({
      published: true,
      site: data,
      publicUrl: buildPublicUrl(req, data.slug),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    console.error("Unexpected publish status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorizedResponse();

  try {
    const projectId = await resolveProjectId(context);
    const body = publishSchema.parse((await req.json().catch(() => ({}))) as unknown);
    const supabase = createSupabaseAdminClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, state")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (projectError) {
      console.error("Failed to load project for publish:", projectError);
      return NextResponse.json({ error: "Failed to publish project" }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const baseSlug = slugify(body.slug ?? project.name ?? "site");
    const uniqueSlug = await buildUniqueSlug(supabase, baseSlug, projectId);

    const payload = {
      project_id: projectId,
      owner_id: userId,
      slug: uniqueSlug,
      site_state: project.state as Json,
      is_active: true,
      published_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("published_sites")
      .upsert(payload, { onConflict: "project_id" })
      .select("id, project_id, slug, is_active, published_at, updated_at")
      .single();

    if (error) {
      console.error("Failed to upsert published site:", error);
      return NextResponse.json({ error: "Failed to publish project" }, { status: 500 });
    }

    return NextResponse.json({
      site: data,
      publicUrl: buildPublicUrl(req, data.slug),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    console.error("Unexpected publish error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
