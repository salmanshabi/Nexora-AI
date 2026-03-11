import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AppStateSnapshot } from "@/app/builder/store/types";
import { PublishedSiteRenderer } from "./PublishedSiteRenderer";

type Params = {
  slug: string;
};

async function getPublishedSite(slug: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("published_sites")
    .select("slug, site_state, is_active, updated_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch published site:", error);
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getPublishedSite(slug);
  const state = site?.site_state as AppStateSnapshot | undefined;
  const siteName = state?.websiteProps?.name || slug;

  return {
    title: siteName,
    description: `Published site: ${siteName}`,
  };
}

export default async function PublishedSitePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const site = await getPublishedSite(slug);

  if (!site) {
    notFound();
  }

  const state = site.site_state as AppStateSnapshot;
  return <PublishedSiteRenderer state={state} />;
}
