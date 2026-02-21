"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

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

const menuItems = [
  {
    key: "photo" as const,
    label: "Photo",
    description: "PNG, JPG, GIF, WebP, SVG",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-4.47-4.47a.75.75 0 0 0-1.06 0L2.5 11.06Zm6-1.06a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "file" as const,
    label: "File",
    description: "PDF, DOC, TXT, CSV",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
      </svg>
    ),
  },
  {
    key: "gdrive" as const,
    label: "Google Drive",
    description: "Browse your Drive files",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M7.71 3.5l-5.16 8.93 3.15 5.47h4.04L4.58 8.97l3.13-5.47zm.79 0l5.16 8.93H24l-5.16-8.93H8.5zm7.65 10.43H6.09l-3.15 5.47h10.06l3.15-5.47z" />
      </svg>
    ),
  },
  {
    key: "url" as const,
    label: "URL",
    description: "Paste a link to any page or image",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
        <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
      </svg>
    ),
  },
  {
    key: "camera" as const,
    label: "Camera",
    description: "Take a photo with your camera",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute bottom-full mb-2 right-0 w-64 rounded-xl border border-gray-700 bg-gray-900 py-1.5 shadow-2xl shadow-black/40 z-50"
        >
          <div className="px-3 py-1.5 mb-1 border-b border-gray-800">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              Attach from
            </span>
          </div>

          {menuItems.map((item, i) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: i * 0.03 }}
              onClick={() => {
                handlers[item.key]();
                onClose();
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-800/80 transition-colors duration-150 group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all duration-200">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-150">
                  {item.label}
                </span>
                <span className="text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors duration-150">
                  {item.description}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
