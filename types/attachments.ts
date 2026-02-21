export type AttachmentSource = "local" | "gdrive" | "url" | "camera";

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  size: number;
  preview?: string; // Object URL or thumbnail URL
  source: AttachmentSource;
  sourceMetadata?: {
    // Google Drive
    gdriveFileId?: string;
    gdriveUrl?: string;
    gdriveMimeType?: string;
    // URL
    originalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    // Camera
    capturedAt?: string; // ISO timestamp
  };
  file?: File; // Raw file for local/camera sources
}

export type DropdownOption = "photo" | "file" | "gdrive" | "url" | "camera";
