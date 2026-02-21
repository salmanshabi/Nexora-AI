"use client";

import { motion } from "framer-motion";
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

function getSourceBadge(source: Attachment["source"]) {
  switch (source) {
    case "gdrive":
      return (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white" title="Google Drive">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
            <path d="M7.71 3.5l-5.16 8.93 3.15 5.47h4.04L4.58 8.97l3.13-5.47zm.79 0l5.16 8.93H24l-5.16-8.93H8.5zm7.65 10.43H6.09l-3.15 5.47h10.06l3.15-5.47z" />
          </svg>
        </div>
      );
    case "url":
      return (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-white" title="From URL">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
            <path d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" />
            <path d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" />
          </svg>
        </div>
      );
    case "camera":
      return (
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white" title="Camera capture">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
            <path d="M6.5 2.25a.75.75 0 0 0-1.228-.579L2.688 4H1.5A1.5 1.5 0 0 0 0 5.5v5A1.5 1.5 0 0 0 1.5 12h2.688l2.584 2.329A.75.75 0 0 0 8 13.75v-11.5Z" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

export default function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-5 pt-3 pb-1">
      {attachments.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="group relative flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-1.5"
        >
          {/* Source badge */}
          {getSourceBadge(file.source)}

          {/* Thumbnail or icon */}
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <span className="text-sm">{getFileIcon(file.type)}</span>
          )}

          {/* Name and size */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 max-w-[120px] truncate">
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

          {/* Remove button */}
          <button
            onClick={() => onRemove(file.id)}
            className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
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
      ))}
    </div>
  );
}
