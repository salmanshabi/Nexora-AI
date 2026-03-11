"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AttachmentDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: () => void;
  onSelectFile: () => void;
  onSelectGDrive: () => void;
  onSelectUrl: () => void;
  onSelectCamera: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

/* ── Grouped menu sections ───────────────────────────────────── */
const sections = [
  {
    title: "Local",
    items: [
      {
        key: "photo" as const,
        label: "Photo",
        description: "PNG, JPG, GIF, WebP, SVG",
        accent: "34,211,238",      // cyan RGB
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
            <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-4.47-4.47a.75.75 0 0 0-1.06 0L2.5 11.06Zm6-1.06a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        key: "file" as const,
        label: "File",
        description: "PDF, DOC, TXT, CSV",
        accent: "139,92,246",      // violet RGB
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
            <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
          </svg>
        ),
      },
      {
        key: "camera" as const,
        label: "Camera",
        description: "Take a photo",
        accent: "16,185,129",      // emerald RGB
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
            <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Cloud",
    items: [
      {
        key: "gdrive" as const,
        label: "Google Drive",
        description: "Browse your files",
        accent: "59,130,246",      // blue RGB
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
            <path d="M7.71 3.5l-5.16 8.93 3.15 5.47h4.04L4.58 8.97l3.13-5.47zm.79 0l5.16 8.93H24l-5.16-8.93H8.5zm7.65 10.43H6.09l-3.15 5.47h10.06l3.15-5.47z" />
          </svg>
        ),
      },
      {
        key: "url" as const,
        label: "URL",
        description: "Paste a link",
        accent: "168,85,247",      // purple RGB
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
            <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
            <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
          </svg>
        ),
      },
    ],
  },
];

/* ── Single menu item with hover state ─────────────────────── */
function MenuItem({
  item,
  idx,
  onClick,
}: {
  item: (typeof sections)[number]["items"][number];
  idx: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = item.accent;

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: 0.05 + idx * 0.05, ease: "easeOut" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
      style={{
        backgroundColor: hovered ? `rgba(${rgb}, 0.08)` : "transparent",
      }}
    >
      {/* Icon container with per-item glow */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300"
        style={{
          backgroundColor: `rgba(${rgb}, ${hovered ? 0.18 : 0.08})`,
          borderColor: `rgba(${rgb}, ${hovered ? 0.4 : 0.15})`,
          color: hovered ? `rgb(${rgb})` : "rgb(156,163,175)",
          boxShadow: hovered ? `0 0 10px rgba(${rgb}, 0.25)` : "none",
        }}
      >
        {item.icon}
      </div>

      <div className="flex flex-col min-w-0">
        <span
          className="text-[13px] font-medium transition-colors duration-200"
          style={{ color: hovered ? "#fff" : "rgb(229,231,235)" }}
        >
          {item.label}
        </span>
        <span
          className="text-[11px] transition-colors duration-200"
          style={{ color: hovered ? "rgb(156,163,175)" : "rgb(75,85,99)" }}
        >
          {item.description}
        </span>
      </div>

      {/* Hover arrow indicator */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="ml-auto h-3.5 w-3.5 transition-all duration-200"
        style={{
          color: hovered ? `rgb(${rgb})` : "rgb(55,65,81)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-4px)",
        }}
      >
        <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
      </svg>
    </motion.button>
  );
}

export default function AttachmentDropdown({
  isOpen,
  onClose,
  onSelectPhoto,
  onSelectFile,
  onSelectGDrive,
  onSelectUrl,
  onSelectCamera,
  buttonRef,
}: AttachmentDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlers: Record<string, () => void> = {
    photo: onSelectPhoto,
    file: onSelectFile,
    gdrive: onSelectGDrive,
    url: onSelectUrl,
    camera: onSelectCamera,
  };

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, buttonRef]);

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute top-full mt-3 left-0 w-72 rounded-2xl border border-gray-700/60 bg-gray-950/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] z-50 overflow-hidden"
        >
          {/* Subtle top gradient accent line */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          {sections.map((section, sectionIdx) => (
            <div key={section.title}>
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: sectionIdx * 0.08 }}
                className="px-4 pt-3 pb-1.5"
              >
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                  {section.title}
                </span>
              </motion.div>

              {/* Section items */}
              <div className="px-2 pb-2 flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const idx = globalIndex++;
                  return (
                    <MenuItem
                      key={item.key}
                      item={item}
                      idx={idx}
                      onClick={() => {
                        handlers[item.key]();
                        onClose();
                      }}
                    />
                  );
                })}
              </div>

              {/* Animated divider between sections */}
              {sectionIdx < sections.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                  className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent origin-left"
                />
              )}
            </div>
          ))}

          {/* Subtle bottom padding */}
          <div className="h-1" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
