import { NextRequest, NextResponse } from "next/server";

function extractMeta(html: string, property: string): string | null {
  // Try property= first (Open Graph style)
  const propRegex = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const propMatch = html.match(propRegex);
  if (propMatch) return propMatch[1];

  // Try content= before property= (reversed attribute order)
  const reversedRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    "i"
  );
  const reversedMatch = html.match(reversedRegex);
  if (reversedMatch) return reversedMatch[1];

  // Try name= variant (Twitter cards, etc.)
  const nameRegex = new RegExp(
    `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const nameMatch = html.match(nameRegex);
  return nameMatch ? nameMatch[1] : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractFavicon(html: string, baseUrl: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i
  );
  if (!match) {
    // Try reversed order
    const reversed = html.match(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i
    );
    if (!reversed) return null;
    try {
      return new URL(reversed[1], baseUrl).href;
    } catch {
      return null;
    }
  }
  try {
    return new URL(match[1], baseUrl).href;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "Only HTTP/HTTPS URLs are allowed" }, { status: 400 });
    }

    // Block internal IPs (SSRF protection)
    const hostname = parsedUrl.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("172.") ||
      hostname === "0.0.0.0"
    ) {
      return NextResponse.json({ error: "Internal URLs are not allowed" }, { status: 400 });
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "NexoraBot/1.0" },
      redirect: "follow",
    });
    clearTimeout(timeout);

    const contentType = res.headers.get("content-type") || "";

    // If it's a direct image, return image metadata
    if (contentType.startsWith("image/")) {
      const contentLength = res.headers.get("content-length");
      return NextResponse.json({
        title: url.split("/").pop()?.split("?")[0] || "Image",
        ogImage: url,
        contentType,
        size: contentLength ? parseInt(contentLength) : 0,
        isDirectImage: true,
      });
    }

    // Parse HTML for OG tags
    const html = await res.text();
    const ogImage =
      extractMeta(html, "og:image") ||
      extractMeta(html, "twitter:image") ||
      extractMeta(html, "twitter:image:src");
    const ogTitle =
      extractMeta(html, "og:title") ||
      extractMeta(html, "twitter:title") ||
      extractTitle(html);
    const ogDescription =
      extractMeta(html, "og:description") ||
      extractMeta(html, "twitter:description") ||
      extractMeta(html, "description");
    const favicon = extractFavicon(html, url);

    // Resolve relative og:image URLs
    let resolvedOgImage = ogImage;
    if (ogImage && !ogImage.startsWith("http")) {
      try {
        resolvedOgImage = new URL(ogImage, url).href;
      } catch {
        resolvedOgImage = ogImage;
      }
    }

    return NextResponse.json({
      title: ogTitle || hostname,
      description: ogDescription,
      ogImage: resolvedOgImage,
      favicon,
      contentType,
      size: 0,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 408 });
    }
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
