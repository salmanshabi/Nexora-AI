// ============================================================
// Smart Prompt Analyzer
// Extracts business name, description, audience, style,
// color palette, and pages from a natural-language prompt.
// ============================================================

// --- Business Name Extraction ---

const GENERIC_TITLE_PHRASES = new Set([
  "online store", "landing page", "web site", "website", "home page",
  "about page", "contact page", "dark theme", "light theme",
  "modern portfolio", "gallery section", "pricing table", "contact form",
  "web app", "mobile app", "blog post", "class schedules",
  "single page", "multi page", "full stack",
]);

// Words that should NOT be capitalized in a Title Case pass (articles, prepositions, etc.)
const TITLE_CASE_EXCEPTIONS = new Set([
  "a", "an", "the", "and", "or", "but", "nor", "for", "yet", "so",
  "in", "on", "at", "to", "of", "by", "with", "from", "up", "as",
  "into", "about", "is", "my", "our", "your", "their",
]);

/**
 * Converts a string to Title Case, respecting exceptions for small words.
 * Always capitalizes the first word. Used to normalize lowercase prompts
 * so the name-extraction regex patterns (which require [A-Z]) can match.
 */
function toTitleCase(str: string): string {
  return str.replace(/\S+/g, (word, index) => {
    // Always capitalize the first word, otherwise skip small words
    if (index > 0 && TITLE_CASE_EXCEPTIONS.has(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/**
 * Core pattern cascade — runs against text that has proper capitalization.
 * Returns the extracted business name or "" if no pattern matches.
 */
function extractNameFromText(desc: string): string {
  // Pattern A: Explicit naming — "called X" / "named X" / "name is X"
  const patternA =
    /(?:called|named|name\s+is)\s+["']?([A-Z][A-Za-z0-9][\w\s&'.+:\-]*?)["']?(?:\s*[,;:.\-]+\s*(?:a|an|the|is|was|who|which|that|specializing|focusing|offering|featuring|providing|serving|targeting|based|located)\b|\s*[,;:.\-]+\s*$|\s+(?:with|for|that|which|who|specializing|focusing|offering|featuring|providing|serving|targeting)\b|\s*$)/;
  const matchA = desc.match(patternA);
  if (matchA) return cleanName(matchA[1]);

  // Pattern B: "for {CapitalizedName}," / "for {Name} -"
  // Terminates at: comma/semicolon + article, end-of-string, or keywords (with, by, called, named, etc.)
  const patternB =
    /\bfor\s+["']?([A-Z][A-Za-z0-9][\w\s&'.+:\-]*?)["']?(?:\s*[,;:.\-]+\s*(?:a|an|the|is|was|who|which|that|specializing|focusing|offering|featuring|providing|serving|targeting|based|located)\b|\s*[,;:.\-]+\s*$|\s+(?:with|by|called|named|that|which|who|specializing|focusing|offering|featuring|providing|serving|targeting)\b|\s*$)/;

  // Pattern C: "by {CapitalizedName}"
  const patternC =
    /\bby\s+["']?([A-Z][A-Za-z0-9][\w\s&'.+:\-]*?)["']?(?:\s*[,;:.\-]+|\s+(?:a|an|the|with|for|that|which|who|specializing|focusing|offering|featuring|providing|serving|targeting)\b|\s*$)/;

  // When both "for" and "by" exist, prefer "by" (Pattern C) — it indicates
  // the maker/brand, while "for" more likely indicates the product category.
  // E.g. "online store for handmade jewelry by Luna Crafts" → Luna Crafts, not Handmade Jewelry
  const hasByKeyword = /\bby\s+[A-Z]/i.test(desc);
  const matchB = desc.match(patternB);
  const matchC = desc.match(patternC);

  if (hasByKeyword && matchC) return cleanName(matchC[1]);
  if (matchB) return cleanName(matchB[1]);
  if (matchC) return cleanName(matchC[1]);

  // Pattern D: Title Case fallback — 2+ consecutive capitalized words
  const titleCasePattern =
    /\b([A-Z][a-z]+(?:\s+(?:[A-Z][a-z]+|&|of|the|and|in))*(?:\s+[A-Z][a-z]+)+)\b/g;
  let tcMatch;
  while ((tcMatch = titleCasePattern.exec(desc)) !== null) {
    const candidate = tcMatch[1].trim();
    if (
      !GENERIC_TITLE_PHRASES.has(candidate.toLowerCase()) &&
      candidate.length >= 3
    ) {
      return cleanName(candidate);
    }
  }

  // Pattern E: Handle mixed-case names like "TechVision AI", "FitLife Gym"
  const mixedCasePattern =
    /\bfor\s+["']?([A-Z][\w]*(?:\s+[A-Z][\w]*)+)["']?\s*(?:[,;:.\- ]|$)/;
  const mixedMatch = desc.match(mixedCasePattern);
  if (mixedMatch) return cleanName(mixedMatch[1]);

  return "";
}

/**
 * Selectively Title-Case only the words in "name positions" — i.e. the segment
 * after for/called/named/by and before the next delimiter (, ; : - with etc.).
 * This avoids Title-Casing the entire string which would make everything look
 * like a proper noun and cause false matches.
 *
 * "website for acme corp"                  → "website for Acme Corp"
 * "bakery called sweet treats with gallery" → "bakery called Sweet Treats with gallery"
 * "handmade jewelry by luna crafts"         → "handmade jewelry by Luna Crafts"
 */
function capitalizeNamePositions(desc: string): string {
  // Process keywords in reverse priority: first called/named, then by, then for.
  // This ensures "for X called Y" capitalizes Y (not the whole "X called Y").

  // Pass 1: "called/named {name}" — highest priority, most specific
  let result = desc.replace(
    /\b(called|named|name\s+is)\s+([^,;:\-]+?)(?=\s*(?:[,;:\-]|\s+(?:with|that|which|who|specializing|focusing|offering|featuring|providing|serving|targeting|based|located)\b)|$)/gi,
    (_m, kw, seg) => `${kw} ${titleCaseSegment(seg)}`,
  );

  // Pass 2: "by {name}" — stop at called/named too
  result = result.replace(
    /\b(by)\s+([^,;:\-]+?)(?=\s*(?:[,;:\-]|\s+(?:with|that|which|who|called|named|specializing|focusing|offering|featuring|providing|serving|targeting|based|located)\b)|$)/gi,
    (_m, kw, seg) => `${kw} ${titleCaseSegment(seg)}`,
  );

  // Pass 3: "for {name}" — stop at called/named/by too (avoids capturing "for X by Y" as one name)
  result = result.replace(
    /\b(for)\s+([^,;:\-]+?)(?=\s*(?:[,;:\-]|\s+(?:with|that|which|who|called|named|by|specializing|focusing|offering|featuring|providing|serving|targeting|based|located)\b)|$)/gi,
    (_m, kw, seg) => `${kw} ${titleCaseSegment(seg)}`,
  );

  return result;
}

/**
 * Title-case a name segment, respecting small-word exceptions.
 * If the segment starts with an article/preposition (a, an, the, my, etc.),
 * it's likely a description ("a photographer"), not a name — so we keep it lowercase.
 */
function titleCaseSegment(segment: string): string {
  const words = segment.trim().split(/\s+/);
  if (words.length === 0) return segment;

  // If the first word is an article/preposition, this is probably not a name.
  // Keep it lowercase to prevent false matches like "A Photographer" → looks like a name.
  const firstWordLower = words[0].toLowerCase();
  if (TITLE_CASE_EXCEPTIONS.has(firstWordLower)) {
    return segment; // Don't capitalize — "a photographer" stays "a photographer"
  }

  return words
    .map((word, i) => {
      if (i > 0 && TITLE_CASE_EXCEPTIONS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Public entry point for business name extraction.
 * Tries the original input first (preserves exact casing for names like "TechVision AI").
 * If no pattern matches, retries with selectively capitalized name positions
 * for lowercase prompts like "website for acme corp" → extracts "Acme Corp".
 */
function extractBusinessName(desc: string): string {
  // First pass: try with original casing
  const result = extractNameFromText(desc);
  if (result) return result;

  // Second pass: capitalize only name-position words, then retry
  const capitalized = capitalizeNamePositions(desc);
  if (capitalized !== desc) {
    return extractNameFromText(capitalized);
  }

  return "";
}

function cleanName(raw: string): string {
  const name = raw
    .replace(/[\s,;:.\-]+$/, "") // trailing punctuation
    .replace(/^(?:My|Our|Their|This|That|Your|New)\s+/i, "") // leading possessives
    .trim();

  // If name is too long it's probably a misparsed sentence
  if (name.length > 50) return "";

  return name;
}

// --- Business Description Extraction ---

// Phase 1 — strip the instruction verb phrase: "please help me build/create/make..."
const VERB_PREFIX =
  /^(?:(?:please\s+)?(?:help\s+(?:me\s+)?)?(?:i\s+(?:need|want|would\s+like)\s+)?(?:to\s+)?(?:build|create|make|design|develop|set\s+up|generate)\s+(?:me\s+)?)/i;

// Site-noun pattern — matches the website/site/store/portfolio word + trailing for/of
const SITE_NOUN =
  /\b(?:website|web\s*site|site|web\s*page|landing\s*page|web\s*app|online\s*(?:store|shop|presence)|e-?commerce\s*(?:site|store|shop)?|portfolio(?:\s+site)?|blog(?:\s+site)?)\s*(?:for|about|of|called|named)?\s*/i;

// Style/descriptor adjectives we want to KEEP from before the site-noun.
// Only adjectives that describe the BUSINESS (not the website build request).
// "modern", "sleek", "clean", "responsive" are excluded — they describe the site, not the biz.
const STYLE_ADJECTIVES =
  /\b(luxur(?:y|ious)|elegant|bold|playful|corporate|futuristic|professional|minimal(?:ist)?)\b/gi;

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractBusinessDescription(
  desc: string,
  businessName: string,
): string {
  const dl = desc.toLowerCase();

  // ── Strategy: find descriptive content from the original prompt ──
  // 1. Extract style adjectives that appeared BEFORE the site-noun
  // 2. Extract the "what is this business" segment (between site-noun and name,
  //    or after name)

  // Step 1: Capture business-descriptive words that appear BEFORE the site-noun.
  // E.g. "A luxury spa website" → captures "luxury spa"
  // E.g. "Please create a bakery website" → captures "bakery"
  // E.g. "Help me build a modern SaaS website" → captures "saas" (strips "modern")
  const siteNounInDesc = desc.match(
    /(?:website|web\s*site|site|web\s*page|landing\s*page|web\s*app|online\s*(?:store|shop|presence)|e-?commerce\s*(?:site|store|shop)?|portfolio(?:\s+site)?|blog(?:\s+site)?)/i,
  );
  let preNounAdjectives = "";
  if (siteNounInDesc && siteNounInDesc.index !== undefined) {
    const beforeNoun = desc.slice(0, siteNounInDesc.index).trim();
    // Strip ALL instruction-like words to isolate just business-descriptive words
    const stripped = beforeNoun
      .replace(VERB_PREFIX, "")
      // Strip remaining instruction phrases not caught by VERB_PREFIX
      .replace(
        /^(?:(?:please\s+)?(?:help\s+(?:me\s+)?)?(?:i\s+(?:need|want|would\s+like)\s+)?(?:to\s+)?)/i,
        "",
      )
      .replace(/^(?:a|an|the|my|our|your|their|new)\s*/i, "")
      .trim();
    if (stripped.length > 0) {
      // Remove meta-adjectives that describe the SITE, not the business
      const descriptor = stripped
        .replace(
          /\b(?:modern|sleek|clean|responsive|new|dark[\s-]*themed?|light[\s-]*themed?)\b/gi,
          "",
        )
        .replace(/\s{2,}/g, " ")
        .trim();
      if (descriptor.length > 0) {
        preNounAdjectives = descriptor.toLowerCase();
      }
    }
  }

  // Step 2: Strip the meta-instruction prefix using position-based approach
  // Phase 1: Strip the verb phrase ("Please help me build/create...")
  let text = desc.replace(VERB_PREFIX, "").trim();
  // Phase 2: Find and strip everything up to and including the site-noun + "for/of"
  // E.g. "a modern SaaS website for" → strip all of it
  // E.g. "a bakery website called" → strip all of it
  const siteNounInText = text.match(SITE_NOUN);
  if (siteNounInText && siteNounInText.index !== undefined) {
    text = text.slice(siteNounInText.index + siteNounInText[0].length).trim();
  }

  // Step 3: Handle "my restaurant called Name" → extract "restaurant" as descriptor
  const calledPattern =
    /^(?:my\s+|our\s+|their\s+)?(.+?)\s+(?:called|named)\s+/i;
  const calledMatch = text.match(calledPattern);
  let preNameDescriptor = "";
  if (calledMatch) {
    preNameDescriptor = calledMatch[1].trim();
    // Strip everything up to and including "called/named Name[,;:-]"
    text = text
      .replace(/^(?:my\s+|our\s+|their\s+)?.*?(?:called|named)\s+/i, "")
      .trim();
  }

  // Step 4: Strip the business name + separator from the start
  if (businessName) {
    const nameEscaped = escapeRegex(businessName);

    // "Name, a description..." or "Name - description..."
    const nameLeadPattern = new RegExp(
      `^${nameEscaped}\\s*[,;:\\-]+\\s*`,
      "i",
    );
    if (nameLeadPattern.test(text)) {
      text = text.replace(nameLeadPattern, "").trim();
    } else if (text.toLowerCase().startsWith(businessName.toLowerCase())) {
      // Name at start with just a space
      text = text.slice(businessName.length).trim();
      text = text.replace(/^[,;:\-]+\s*/, "").trim();
    }

    // Also strip "by Name" residue
    const byPattern = new RegExp(
      `^by\\s+${nameEscaped}\\s*[,;:\\-]?\\s*`,
      "i",
    );
    text = text.replace(byPattern, "").trim();

    // Strip "for Name" residue (if name appears at start after "for")
    const forNamePattern = new RegExp(
      `^for\\s+${nameEscaped}\\s*[,;:\\-]?\\s*`,
      "i",
    );
    text = text.replace(forNamePattern, "").trim();

    // Strip name if it appears elsewhere at start
    if (text.toLowerCase().startsWith(businessName.toLowerCase())) {
      text = text.slice(businessName.length).replace(/^\s*[,;:\-]+\s*/, "").trim();
    }
  }

  // Step 5: Strip "called/named Name, ..." residue (if not caught above)
  text = text
    .replace(/^(?:called|named|name\s+is)\s+.*?[,;:\-]+\s*/i, "")
    .trim();

  // Step 6: Strip site-noun words that leaked through
  text = text.replace(
    /^(?:website|web\s*site|site|web\s*page|landing\s*page|web\s*app|portfolio|blog)\s*/i,
    "",
  ).trim();
  // Strip "for" that may remain after site-noun removal
  text = text.replace(/^(?:for|about|of)\s+/i, "").trim();

  // Step 7: If we still have the business name embedded, strip it
  if (businessName) {
    const nameEscaped = escapeRegex(businessName);
    const embeddedName = new RegExp(
      `\\b${nameEscaped}\\b\\s*[,;:\\-]?\\s*`,
      "i",
    );
    text = text.replace(embeddedName, "").trim();
  }

  // Step 8: Strip leading articles and possessives
  text = text.replace(/^(?:a|an|the|my|our|your|their|this|that)\s+/i, "");

  // Step 9: Strip site-noun words that appear anywhere (not just at start)
  // e.g. "Luxury spa website" → "Luxury spa"
  text = text
    .replace(
      /\b(?:website|web\s*site|site|web\s*page|landing\s*page|web\s*app)\b/gi,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();

  // Step 10: Strip "with ..." clauses that describe page features or styling,
  // not the business itself. E.g. "with pricing and class schedules",
  // "with a dark theme", "with a warm color scheme"
  // Handles both "with X" at start and "photographer with gallery section" mid-string.
  const PAGE_FEATURE_WORDS =
    /(?:(?:a\s+)?(?:pricing|gallery|blog|contact|faq|shop|store|cart|checkout|class\s*schedules?|testimonials?|portfolio|reviews?|newsletter|section|page))\b/i;
  const STYLE_WORDS =
    /\b(?:theme|color|scheme|layout|animation|font|typography|dark|light|responsive|parallax)\b/i;

  const withClauseMatch = text.match(/\bwith\s+(.+)$/i);
  if (withClauseMatch) {
    const withContent = withClauseMatch[1];
    const isPageFeature = PAGE_FEATURE_WORDS.test(withContent);
    const isStyleInfo = STYLE_WORDS.test(withContent);
    if (isPageFeature || isStyleInfo) {
      // Strip the "with ..." clause — keep everything before it
      text = text.slice(0, withClauseMatch.index!).trim();
    } else if (text.match(/^with\s+/i)) {
      // "with" at start but not page/style — keep the content after "with"
      text = withContent.trim();
    }
  }

  // Step 11: Strip trailing prepositions/connectors (by, for, with, etc.)
  text = text.replace(
    /\s+(?:by|for|with|and|or|the|a|an|in|on|at|to|of)\s*$/i,
    "",
  ).trim();

  // Step 12: Prepend recovered adjectives if description doesn't already include them
  // E.g. "luxury spa website for X" → adj = "luxury", text = "" → result = "Luxury spa"
  if (preNounAdjectives && preNameDescriptor) {
    // We have both — combine: "luxury" + "spa" → "Luxury spa"
    const combined = `${preNounAdjectives} ${preNameDescriptor}`;
    if (!text.toLowerCase().includes(preNounAdjectives)) {
      text = text ? `${combined}. ${text}` : combined;
    }
  } else if (preNameDescriptor) {
    // "my restaurant called X" → descriptor = "restaurant"
    if (!text.toLowerCase().includes(preNameDescriptor.toLowerCase())) {
      text = text ? `${preNameDescriptor}. ${text}` : preNameDescriptor;
    }
  } else if (preNounAdjectives && !text.toLowerCase().includes(preNounAdjectives)) {
    // Only style adjectives from before the noun
    text = text ? `${preNounAdjectives} ${text}` : preNounAdjectives;
  }

  // Step 11: Capitalize first letter
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Step 12: Truncate at ~200 chars on a word boundary
  if (text.length > 200) {
    const truncated = text.slice(0, 200);
    const lastSpace = truncated.lastIndexOf(" ");
    text = lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated;
  }

  // Step 13: Clean trailing dangling words and punctuation
  text = text.replace(
    /\s+(?:and|with|for|or|the|a|an|in|on|at|to|of)\s*$/i,
    "",
  );
  text = text.replace(/[,;:\-\s]+$/, "").trim();

  // Only return if meaningful (>= 5 chars — short but valid descriptors like
  // "Bakery", "Salon", "Gym" are still useful pre-fills)
  return text.length >= 5 ? text : "";
}

// --- Main Exported Analyzer ---

export function analyzeDescription(desc: string): Record<string, string> {
  const d = desc.toLowerCase();
  const result: Record<string, string> = {};

  // ============================================
  // Business Name & Description Extraction
  // ============================================
  const extractedName = extractBusinessName(desc);
  if (extractedName) {
    result.businessName = extractedName;
  }

  const extractedDesc = extractBusinessDescription(desc, extractedName);
  if (extractedDesc) {
    result.businessDescription = extractedDesc;
  }

  // ============================================
  // Audience Gender (keyword matching)
  // ============================================
  const genderKeywords: Record<string, string[]> = {
    Men: ["men", "male", "gentleman", "barber", "grooming", "menswear"],
    Women: [
      "women", "female", "lady", "salon", "beauty", "bridal",
      "maternity", "womenswear",
    ],
    Teens: [
      "teen", "youth", "young", "student", "college", "university", "gen z",
    ],
    Children: [
      "kid", "child", "baby", "toddler", "nursery", "daycare", "toy",
      "playground",
    ],
    Elderly: ["senior", "elderly", "retire", "aged care", "nursing home"],
  };
  const matchedGenders: string[] = [];
  for (const [gender, keywords] of Object.entries(genderKeywords)) {
    if (keywords.some((kw) => d.includes(kw))) matchedGenders.push(gender);
  }
  result.audienceGender =
    matchedGenders.length > 0 ? matchedGenders.join(", ") : "Everyone";

  // ============================================
  // Audience Age (keyword matching)
  // ============================================
  const ageKeywords: Record<string, string[]> = {
    "Under 18": ["kid", "child", "teen", "school", "toy", "baby", "toddler"],
    "18\u201324": ["college", "university", "student", "gen z", "young adult"],
    "25\u201334": ["startup", "freelanc", "young professional", "millennial"],
    "35\u201344": ["family", "parent", "mid-career", "corporate"],
    "45\u201354": ["executive", "senior professional", "established"],
    "55+": ["senior", "retire", "elderly", "aged"],
  };
  const matchedAges: string[] = [];
  for (const [age, keywords] of Object.entries(ageKeywords)) {
    if (keywords.some((kw) => d.includes(kw))) matchedAges.push(age);
  }
  result.audienceAge =
    matchedAges.length > 0 ? matchedAges.join(", ") : "All Ages";

  // ============================================
  // Style (regex matching)
  // ============================================
  if (/luxur|premium|high.?end|fine dining|boutique|exclusive/i.test(d))
    result.style = "Elegant";
  else if (/tech|ai|software|saas|app|digital|cyber|crypto/i.test(d))
    result.style = "Futuristic";
  else if (/fun|game|party|play|entertainment|comic|cartoon/i.test(d))
    result.style = "Playful";
  else if (/bold|extreme|sport|adventure|fitness|gym|street/i.test(d))
    result.style = "Bold";
  else if (
    /law|finance|consult|accounting|insurance|enterprise|corporate/i.test(d)
  )
    result.style = "Corporate";
  else result.style = "Minimal";

  // ============================================
  // Colors (regex matching)
  // ============================================
  if (/nature|garden|organic|farm|plant|eco|vegan|green/i.test(d))
    result.colors = "Forest";
  else if (/ocean|sea|marine|aqua|surf|beach|water|swim/i.test(d))
    result.colors = "Ocean";
  else if (/luxur|premium|elegant|fine|wine|gold/i.test(d))
    result.colors = "Midnight";
  else if (/tech|ai|software|saas|cyber|neon|digital/i.test(d))
    result.colors = "Neon";
  else if (/kid|child|baby|toy|candy|sweet|dessert|bakery|cake/i.test(d))
    result.colors = "Candy";
  else if (/coffee|wood|leather|vintage|rustic|craft/i.test(d))
    result.colors = "Earth";
  else if (/beauty|salon|spa|wellness|yoga|pastel/i.test(d))
    result.colors = "Pastel";
  else if (/food|restaurant|pizza|burger|bbq|grill|spice/i.test(d))
    result.colors = "Warm";
  else if (/fashion|model|photo|art|creative|design/i.test(d))
    result.colors = "Berry";
  else if (/clean|minimal|simple|modern|agency/i.test(d))
    result.colors = "Monochrome";
  else result.colors = "Minimal";

  // ============================================
  // Pages (keyword matching + smart defaults)
  // ============================================
  const pageKeywords: Record<string, string[]> = {
    Home: ["home"],
    About: ["about", "story", "team", "who we are"],
    Pricing: [
      "pricing", "price", "plan", "subscription", "package", "cost",
    ],
    Contact: ["contact", "reach", "support", "help"],
    Blog: ["blog", "article", "news", "post", "journal", "write"],
    Gallery: [
      "gallery", "portfolio", "photo", "image", "work", "project", "showcase",
    ],
    Shop: [
      "shop", "store", "buy", "product", "ecommerce", "e-commerce", "sell",
      "order", "cart",
    ],
    FAQ: ["faq", "question", "help", "support"],
  };
  const matchedPages = ["Home"];
  for (const [page, keywords] of Object.entries(pageKeywords)) {
    if (page === "Home") continue;
    if (keywords.some((kw) => d.includes(kw))) matchedPages.push(page);
  }
  // Smart defaults
  if (matchedPages.length <= 1) {
    matchedPages.push("About", "Contact");
    if (/store|shop|sell|product|ecommerce/i.test(d))
      matchedPages.push("Shop", "Pricing");
    if (/photo|portfolio|art|design|architect/i.test(d))
      matchedPages.push("Gallery");
    if (/blog|write|journal|news/i.test(d)) matchedPages.push("Blog");
    if (/service|agency|consult|freelanc|plan/i.test(d))
      matchedPages.push("Pricing");
  }
  result.pages = [...new Set(matchedPages)].join(", ");

  return result;
}
