/* eslint-disable @typescript-eslint/no-explicit-any */

// Google API Loader (gapi)
interface Gapi {
  load(api: string, callback: () => void): void;
}

// Google Picker API — using classes for constructable types
declare namespace google.picker {
  const ViewId: {
    DOCS: string;
    DOCS_IMAGES: string;
    DOCUMENTS: string;
    SPREADSHEETS: string;
    PHOTOS: string;
    PDFS: string;
  };

  const Action: {
    CANCEL: string;
    PICKED: string;
  };

  const Response: {
    ACTION: string;
    DOCUMENTS: string;
    PARENTS: string;
    VIEW: string;
  };

  const Document: {
    ID: string;
    NAME: string;
    URL: string;
    MIME_TYPE: string;
    ICON_URL: string;
    THUMBNAILS: string;
    SIZE_BYTES: string;
  };

  const Feature: {
    MULTISELECT_ENABLED: string;
    SIMPLE_UPLOAD_ENABLED: string;
  };

  class PickerBuilder {
    constructor();
    addView(viewOrId: any): PickerBuilder;
    setOAuthToken(token: string): PickerBuilder;
    setDeveloperKey(key: string): PickerBuilder;
    setAppId(appId: string): PickerBuilder;
    setCallback(callback: (data: any) => void): PickerBuilder;
    enableFeature(feature: string): PickerBuilder;
    setTitle(title: string): PickerBuilder;
    build(): Picker;
  }

  class Picker {
    setVisible(visible: boolean): void;
    dispose(): void;
  }
}

// Google Identity Services (GIS)
declare namespace google.accounts.oauth2 {
  interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    error?: string;
    error_description?: string;
  }

  interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
    error_callback?: (error: any) => void;
  }

  interface TokenClient {
    requestAccessToken(overrides?: { prompt?: string }): void;
    callback: (response: TokenResponse) => void;
  }

  function initTokenClient(config: TokenClientConfig): TokenClient;
}

// Extend Window interface
interface Window {
  gapi: Gapi;
  google: typeof google;
}
