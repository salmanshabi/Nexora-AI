let pickerLoaded = false;
let gisLoaded = false;

/**
 * Lazily loads the Google API client library (gapi) and the Picker module.
 * The script is only added to the DOM once; subsequent calls resolve immediately.
 */
export function loadGooglePickerApi(): Promise<void> {
  if (pickerLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
      if (window.gapi) {
        window.gapi.load("picker", () => {
          pickerLoaded = true;
          resolve();
        });
        return;
      }
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load("picker", () => {
        pickerLoaded = true;
        resolve();
      });
    };
    script.onerror = () => reject(new Error("Failed to load Google API script"));
    document.body.appendChild(script);
  });
}

/**
 * Lazily loads the Google Identity Services (GIS) library for OAuth 2.0.
 * Used for obtaining access tokens via the consent popup.
 */
export function loadGoogleIdentityServices(): Promise<void> {
  if (gisLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      if (window.google?.accounts?.oauth2) {
        gisLoaded = true;
        resolve();
        return;
      }
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gisLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.body.appendChild(script);
  });
}

/**
 * Loads both the Picker API and GIS in parallel.
 */
export async function loadGoogleApis(): Promise<void> {
  await Promise.all([loadGooglePickerApi(), loadGoogleIdentityServices()]);
}
