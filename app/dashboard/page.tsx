import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("projects")
        .select("id, name, updated_at")
        .eq("owner_id", session.user.id)
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Failed to load dashboard projects:", error);
    }

    const projects = (data ?? []).map((project) => ({
        id: project.id,
        name: project.name,
        updatedAt: project.updated_at,
    }));

    return (
        <DashboardClient
            user={{ name: session.user.name || "User", email: session.user.email || "" }}
            projects={projects}
        />
    );
}
