"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Attachment } from "@/types/attachments";

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return "🖼️";
  if (type === "application/pdf") return "📄";
  if (type.includes("word")) return "📝";
  if (type === "text/csv") return "📊";
  return "📎";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Source badge config (accent colour as RGB) ────────────── */
const sourceBadgeConfig: Record<
  string,
  { rgb: string; label: string; icon: React.ReactNode } | undefined
> = {
  gdrive: {
    rgb: "59,130,246",
    label: "Drive",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
        <path d="M7.71 3.5l-5.16 8.93 3.15 5.47h4.04L4.58 8.97l3.13-5.47zm.79 0l5.16 8.93H24l-5.16-8.93H8.5zm7.65 10.43H6.09l-3.15 5.47h10.06l3.15-5.47z" />
      </svg>
    ),
  },
  url: {
    rgb: "168,85,247",
    label: "URL",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
        <path d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" />
        <path d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" />
      </svg>
    ),
  },
  camera: {
    rgb: "16,185,129",
    label: "Cam",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
        <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-5 pt-3 pb-1">
      <AnimatePresence mode="popLayout">
        {attachments.map((file) => {
          const badge = sourceBadgeConfig[file.source];

          return (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="group relative flex items-center gap-2.5 rounded-xl border border-gray-700/50 bg-gray-900/60 backdrop-blur-sm px-3 py-2 hover:border-gray-600/60 hover:bg-gray-800/60 transition-all duration-200"
            >
              {/* Source badge — floating pill above the chip */}
              {badge && (
                <div
                  className="absolute -top-1.5 -right-1.5 flex h-[18px] items-center gap-0.5 rounded-full px-1.5 text-white"
                  style={{
                    backgroundColor: `rgba(${badge.rgb}, 0.85)`,
                    boxShadow: `0 0 8px rgba(${badge.rgb}, 0.35)`,
                  }}
                >
                  {badge.icon}
                  <span className="text-[8px] font-bold uppercase tracking-wider leading-none ml-0.5">
                    {badge.label}
                  </span>
                </div>
              )}

              {/* Thumbnail or icon */}
              {file.preview ? (
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-gray-700/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle inner glow overlay */}
                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5" />
                </div>
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800/80 border border-gray-700/30 text-sm">
                  {getFileIcon(file.type)}
                </div>
              )}

              {/* Name and meta */}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-gray-200 max-w-[120px] truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-gray-500">
                  {file.source === "url"
                    ? file.sourceMetadata?.originalUrl
                      ? new URL(file.sourceMetadata.originalUrl).hostname
                      : "URL"
                    : formatFileSize(file.size)}
                </span>
              </div>

              {/* Remove button — appears on hover */}
              <button
                onClick={() => onRemove(file.id)}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800/80 border border-gray-700/40 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-2.5 w-2.5"
                >
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
