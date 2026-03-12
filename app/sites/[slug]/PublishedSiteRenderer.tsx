/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactElement } from "react";

import type { AppStateSnapshot, ElementNode, Section } from "@/app/builder/store/types";

const DEFAULT_STATE: AppStateSnapshot = {
  websiteProps: { name: "Published Site" },
  tokens: {
    colors: {
      primary: "#0ea5e9",
      secondary: "#38bdf8",
      background: "#020617",
      text: "#f8fafc",
    },
    typography: {
      headingFont: "system-ui, sans-serif",
      bodyFont: "system-ui, sans-serif",
      baseSizeMultiplier: 1,
    },
    spacing: "comfortable",
    roundness: "slight",
    shadows: "soft",
  },
  pages: [],
};

type PublishedSiteRendererProps = {
  state: AppStateSnapshot;
};

function asStyle(style?: Record<string, string>): CSSProperties {
  if (!style) return {};
  return style as CSSProperties;
}

function spacingPadding(value: Section["layout"]["padding"]) {
  if (value === "compact") return "1.5rem";
  if (value === "spacious") return "4rem";
  return "2.5rem";
}

function renderElement(node: ElementNode, key: string): ReactElement {
  const style = asStyle(node.props.style);

  if (node.type === "Text") {
    return (
      <p key={key} style={{ margin: 0, color: node.props.customColor, ...style }}>
        {node.props.content ?? ""}
      </p>
    );
  }

  if (node.type === "Button") {
    const href = node.props.url || "#";
    return (
      <a
        key={key}
        href={href}
        target={node.props.openInNewTab ? "_blank" : undefined}
        rel={node.props.openInNewTab ? "noopener noreferrer" : undefined}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.7rem 1.1rem",
          borderRadius: "10px",
          textDecoration: "none",
          background: node.props.customBg ?? "#0ea5e9",
          color: node.props.customColor ?? "#111827",
          fontWeight: 600,
          ...style,
        }}
      >
        {node.props.content ?? "Button"}
      </a>
    );
  }

  if (node.type === "Image") {
    return (
      <div key={key} style={{ position: "relative", width: "100%", ...style }}>
        {node.props.url ? (
          <img
            src={node.props.url}
            alt={node.props.altText ?? "Image"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: node.props.objectFit ?? "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              minHeight: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(148, 163, 184, 0.2)",
              color: "#94a3b8",
            }}
          >
            No image
          </div>
        )}
      </div>
    );
  }

  const children = (node.children ?? []).map((child, idx) => renderElement(child, `${key}-${child.id}-${idx}`));
  return (
    <div key={key} style={{ ...style }}>
      {children}
    </div>
  );
}

function renderSection(section: Section, key: string) {
  const elements = section.elements ?? [];
  const columns = section.layout?.columns?.desktop ?? 1;
  const gap =
    section.layout?.columnGap === "none"
      ? "0px"
      : section.layout?.columnGap === "lg"
        ? "2rem"
        : section.layout?.columnGap === "sm"
          ? "0.75rem"
          : "1.25rem";

  return (
    <section
      key={key}
      style={{
        width: "100%",
        padding: `${spacingPadding(section.layout.padding)} 1.25rem`,
      }}
    >
      <div
        style={{
          maxWidth: section.layout.width === "contained" ? "1120px" : "none",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap,
        }}
      >
        {elements.map((node, idx) => renderElement(node, `${key}-${node.id}-${idx}`))}
      </div>
    </section>
  );
}

export function PublishedSiteRenderer({ state }: PublishedSiteRendererProps) {
  const safeState = state && typeof state === "object" ? state : DEFAULT_STATE;
  const pages = safeState.pages ?? [];
  const firstPage = pages[0];

  const title = safeState.websiteProps?.name ?? "Published Site";
  const background = safeState.tokens?.colors?.background ?? "#020617";
  const textColor = safeState.tokens?.colors?.text ?? "#f8fafc";
  const headingFont = safeState.tokens?.typography?.headingFont ?? "system-ui, sans-serif";
  const bodyFont = safeState.tokens?.typography?.bodyFont ?? "system-ui, sans-serif";

  return (
    <main
      style={{
        minHeight: "100vh",
        background,
        color: textColor,
        fontFamily: bodyFont,
      }}
    >
      <header
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "1.25rem 1.25rem 0.5rem",
          borderBottom: "1px solid rgba(148,163,184,0.2)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: headingFont,
            fontSize: "1.35rem",
            fontWeight: 700,
          }}
        >
          {title}
        </h1>
      </header>

      {firstPage ? (
        <div>{firstPage.sections.map((section, idx) => renderSection(section, `${firstPage.id}-${section.id}-${idx}`))}</div>
      ) : (
        <section style={{ padding: "3rem 1.25rem", textAlign: "center", color: "#94a3b8" }}>
          This site has no pages yet.
        </section>
      )}
    </main>
  );
}
