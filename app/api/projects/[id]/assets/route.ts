import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const projectIdSchema = z.string().uuid();

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function getFileExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");
  if (index < 0) return "";
  return fileName.slice(index).toLowerCase();
}

export async function POST(req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const params = await Promise.resolve(context.params);
    const projectId = projectIdSchema.parse(params.id);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image exceeds 10MB limit" }, { status: 413 });
    }

    const supabase = createSupabaseAdminClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (projectError) {
      console.error("Project ownership check failed:", projectError);
      return NextResponse.json({ error: "Failed to validate project ownership" }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const fileExt = getFileExtension(file.name);
    const objectPath = `${userId}/${projectId}/${Date.now()}-${crypto.randomUUID()}${fileExt}`;
    const bytes = await file.arrayBuffer();
    const body = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage
      .from("project-assets")
      .upload(objectPath, body, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Project asset upload failed:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from("project-assets").getPublicUrl(objectPath);

    return NextResponse.json({
      asset: {
        path: objectPath,
        url: publicData.publicUrl,
        contentType: file.type,
        size: file.size,
        name: file.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    console.error("Unexpected project asset upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
