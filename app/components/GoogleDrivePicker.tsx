"use client";

import { useState, useCallback, useEffect } from "react";
import { loadGoogleApis } from "@/backend/lib/google-drive";
import type { Attachment } from "@/types/attachments";

interface GoogleDrivePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (attachments: Attachment[]) => void;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const APP_ID = process.env.NEXT_PUBLIC_GOOGLE_APP_ID || "";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

export default function GoogleDrivePicker({ isOpen, onClose, onSelect }: GoogleDrivePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = useCallback(async () => {
    if (!CLIENT_ID || !API_KEY) {
      setError("Google Drive is not configured. Please add your API credentials to .env.local");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load Google APIs
      await loadGoogleApis();

      // Request an access token via the OAuth consent popup
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            setError(tokenResponse.error_description || "Authentication failed");
            setIsLoading(false);
            onClose();
            return;
          }

          // Build and show the Picker
          const gp = window.google.picker;
          const picker = new gp.PickerBuilder()
            .addView(gp.ViewId.DOCS)
            .addView(gp.ViewId.PHOTOS)
            .setOAuthToken(tokenResponse.access_token)
            .setDeveloperKey(API_KEY)
            .setAppId(APP_ID)
            .setTitle("Select files from Google Drive")
            .enableFeature(gp.Feature.MULTISELECT_ENABLED)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .setCallback((data: any) => {
              if (data[gp.Response.ACTION] === gp.Action.PICKED) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const docs = data[gp.Response.DOCUMENTS] as any[];

                const newAttachments: Attachment[] = docs.map((doc) => ({
                  id: crypto.randomUUID(),
                  name: (doc[gp.Document.NAME] as string) || "Google Drive file",
                  type: (doc[gp.Document.MIME_TYPE] as string) || "application/octet-stream",
                  size: (doc[gp.Document.SIZE_BYTES] as number) || 0,
                  preview:
                    doc[gp.Document.THUMBNAILS]?.[0]?.url ||
                    (doc[gp.Document.ICON_URL] as string) ||
                    undefined,
                  source: "gdrive" as const,
                  sourceMetadata: {
                    gdriveFileId: doc[gp.Document.ID] as string,
                    gdriveUrl: doc[gp.Document.URL] as string,
                    gdriveMimeType: doc[gp.Document.MIME_TYPE] as string,
                  },
                }));

                onSelect(newAttachments);
              }

              // Close regardless of action (picked or cancelled)
              setIsLoading(false);
              onClose();
            })
            .build();

          picker.setVisible(true);
          setIsLoading(false);
        },
        error_callback: () => {
          setError("Google authentication was cancelled or failed");
          setIsLoading(false);
          onClose();
        },
      });

      tokenClient.requestAccessToken({ prompt: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Google Drive");
      setIsLoading(false);
    }
  }, [onClose, onSelect]);

  // Trigger picker when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      openPicker();
    }
  }, [isOpen, openPicker]);

  // This component is mostly headless — the Picker provides its own UI.
  // We only render loading/error states when needed.
  if (!isOpen) return null;

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="mx-4 max-w-sm rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mx-auto h-8 w-8 text-red-400 mb-3">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => { setError(null); onClose(); }}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-6 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <span className="text-sm text-gray-300">Connecting to Google Drive...</span>
        </div>
      </div>
    );
  }

  return null;
}
